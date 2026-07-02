import * as dotenv from 'dotenv';
dotenv.config();
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema.js';

const connectionString = process.env.DATABASE_URL || "postgres://dummy:dummy@127.0.0.1:5432/dummy";

// Prevent Vercel timeouts/hangs: if DATABASE_URL is missing, we use a dummy localhost string.
// This instantly throws ECONNREFUSED when queried, allowing Express to safely catch and return a JSON error!
const pool = new Pool({ connectionString });

export const db = drizzle(pool, { schema });
