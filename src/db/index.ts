// src/db/index.ts
import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import * as schema from './schema.ts';
import * as dotenv from 'dotenv';

dotenv.config();

console.log('Database Pool config keys found:', {
  SQL_HOST: !!process.env.SQL_HOST,
  SQL_USER: !!process.env.SQL_USER,
  SQL_PASSWORD: !!process.env.SQL_PASSWORD,
  SQL_DB_NAME: !!process.env.SQL_DB_NAME,
});

const { Pool } = pg;

export const createPool = () => {
  return new Pool({
    host: process.env.SQL_HOST,
    user: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD,
    database: process.env.SQL_DB_NAME,
    connectionTimeoutMillis: 15000,
  });
};

const pool = createPool();

pool.on('error', (err) => {
  console.error('Unexpected error on idle SQL pool client:', err);
});

export const db = drizzle(pool, { schema });
export { schema };
