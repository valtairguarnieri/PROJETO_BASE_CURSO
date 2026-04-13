import 'dotenv/config';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import { pool } from './db';
import { registerRoutes } from './routes';
import { runMigrations } from './migrations/runner';

const app = Fastify({ logger: true });

async function start() {
  await runMigrations(pool);

  await app.register(cors, { origin: '*' });
  await registerRoutes(app);

  const port = Number(process.env.PORT) || 3000;
  await app.listen({ port, host: '0.0.0.0' });
  console.log(`Servidor rodando na porta ${port}`);
}

start();
