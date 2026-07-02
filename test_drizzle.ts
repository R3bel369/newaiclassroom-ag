import { drizzle } from 'drizzle-orm/node-postgres';
const pool = { query: () => Promise.reject(new Error("Missing URL")) } as any;
try {
  const db = drizzle(pool);
  console.log("Drizzle initialized successfully!");
} catch (err: any) {
  console.error("Drizzle crash:", err.message);
}
