import * as dotenv from 'dotenv';
dotenv.config();
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema.ts';

const connectionString = process.env.DATABASE_URL;

// Prevent Vercel timeouts: if DATABASE_URL is missing, reject queries instantly so Express can catch and return a JSON error
const pool = connectionString 
  ? new Pool({ connectionString }) 
  : { query: () => Promise.reject(new Error("Server Configuration Error: Missing DATABASE_URL Environment Variable in Vercel.")) } as any;

export const db = drizzle(pool, { schema });
