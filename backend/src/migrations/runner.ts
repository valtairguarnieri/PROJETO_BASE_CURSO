import { Pool } from 'pg';
import { migrations } from './index';

export interface Migration {
  version: number;
  name: string;
  up: (pool: Pool) => Promise<void>;
}

async function ensureMigrationsTable(pool: Pool): Promise<void> {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS migrations (
      version   INTEGER PRIMARY KEY,
      name      TEXT NOT NULL,
      applied_at TIMESTAMP DEFAULT NOW()
    );
  `);
}

async function getAppliedVersions(pool: Pool): Promise<number[]> {
  const result = await pool.query('SELECT version FROM migrations ORDER BY version');
  return result.rows.map((r: { version: number }) => r.version);
}

export async function runMigrations(pool: Pool): Promise<void> {
  await ensureMigrationsTable(pool);

  const applied = await getAppliedVersions(pool);
  const pending = migrations.filter((m) => !applied.includes(m.version));

  if (pending.length === 0) {
    console.log('[migrations] Banco de dados atualizado — nenhuma migration pendente.');
    return;
  }

  const sorted = pending.sort((a, b) => a.version - b.version);

  for (const migration of sorted) {
    console.log(`[migrations] Aplicando v${migration.version}: ${migration.name}...`);
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      await migration.up(pool);
      await client.query(
        'INSERT INTO migrations (version, name) VALUES ($1, $2)',
        [migration.version, migration.name]
      );
      await client.query('COMMIT');
      console.log(`[migrations] v${migration.version} aplicada com sucesso.`);
    } catch (err) {
      await client.query('ROLLBACK');
      console.error(`[migrations] Erro na v${migration.version}:`, err);
      throw err;
    } finally {
      client.release();
    }
  }

  console.log(`[migrations] ${sorted.length} migration(s) aplicada(s).`);
}
