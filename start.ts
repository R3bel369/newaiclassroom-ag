import * as dotenv from 'dotenv';
dotenv.config();
import fs from 'fs';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { app } from './server.ts';
import { db } from './src/db/index.ts';
import { users } from './src/db/schema.ts';

const PORT = process.env.PORT || 3000;

(async () => {
  // Run database test on startup and log to file
  try {
    console.log("Running startup database test query...");
    const testResult = await db.select().from(users).limit(1);
    fs.writeFileSync("./db_test_status.log", JSON.stringify({
      status: "success",
      keys: {
        SQL_HOST: process.env.SQL_HOST,
        SQL_USER: process.env.SQL_USER,
        SQL_PASSWORD: process.env.SQL_PASSWORD ? "SET" : "NOT SET",
        SQL_DB_NAME: process.env.SQL_DB_NAME,
      },
      testResult
    }, null, 2));
    console.log("Startup database test query succeeded.");
  } catch (err: any) {
    console.error("Startup database test query failed:", err);
    fs.writeFileSync("./db_test_status.log", JSON.stringify({
      status: "error",
      message: err.message,
      stack: err.stack,
    }, null, 2));
  }

  // Vite Middleware Setup for Local Dev
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(import("express").then(e => e.static(distPath)) as any);
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, () => {
    console.log(`Server starting on port ${PORT}`);
  });
})();
