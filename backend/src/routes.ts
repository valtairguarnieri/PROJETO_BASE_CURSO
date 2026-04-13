import { FastifyInstance } from 'fastify';
import { pool } from './db';

export async function registerRoutes(app: FastifyInstance) {
  app.get('/health', async () => {
    return { status: 'ok', timestamp: new Date() };
  });

  app.get('/api/items', async () => {
    const result = await pool.query('SELECT * FROM items ORDER BY criado_em DESC');
    return result.rows;
  });

  app.post('/api/items', async (request, reply) => {
    const { nome } = request.body as { nome: string };
    const result = await pool.query(
      'INSERT INTO items (nome) VALUES ($1) RETURNING *',
      [nome]
    );
    return reply.status(201).send(result.rows[0]);
  });
}
