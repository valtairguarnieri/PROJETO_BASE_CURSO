import { Pool } from 'pg';

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/sistema',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});
