import { Migration } from './runner';

export const migration_001: Migration = {
  version: 1,
  name: 'create_items',
  up: async (pool) => {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS items (
        id        SERIAL PRIMARY KEY,
        nome      TEXT NOT NULL,
        criado_em TIMESTAMP DEFAULT NOW()
      );
    `);
  },
};
