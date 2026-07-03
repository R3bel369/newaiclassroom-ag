import * as dotenv from 'dotenv';
dotenv.config();
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema.js';

let connectionString = process.env.DATABASE_URL || "postgres://dummy:dummy@127.0.0.1:5432/dummy";

// OPTIMIZATION: Fix Supabase connection exhaustion lag on Vercel
// Vercel Serverless functions create many concurrent connections. Supabase provides port 6543 
// specifically for Transaction Pooling (PgBouncer) to prevent database locks and lag.
if (connectionString.includes('pooler.supabase.com:5432')) {
  connectionString = connectionString.replace(':5432', ':6543');
}

// Prevent Vercel timeouts/hangs: if DATABASE_URL is missing, we use a dummy localhost string.
const pool = new Pool({ 
  connectionString,
  max: 1 // CRITICAL: Serverless functions should only hold 1 connection per instance
});

export const db = drizzle(pool, { schema });
