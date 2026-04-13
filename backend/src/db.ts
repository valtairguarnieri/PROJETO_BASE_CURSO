import { Pool } from 'pg';

const isProduction = process.env.NODE_ENV === 'production';

// Produção (Railway): URL interna (rede privada)
const DATABASE_URL = 'postgresql://postgres:fWOtXTIEGNvJGoIYTqdGCrGQaseWIfRI@postgres.railway.internal:5432/railway';

// Desenvolvimento (local): URL pública
const DATABASE_URL_PUBLIC = 'postgresql://postgres:fWOtXTIEGNvJGoIYTqdGCrGQaseWIfRI@monorail.proxy.rlwy.net:16293/railway';

export const pool = new Pool({
  connectionString: isProduction ? DATABASE_URL : DATABASE_URL_PUBLIC,
  ssl: isProduction ? { rejectUnauthorized: false } : false,
});
