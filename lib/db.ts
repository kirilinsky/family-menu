import "server-only";
import { createClient, type Client } from "@libsql/client";

// Turso in production (TURSO_DATABASE_URL + TURSO_AUTH_TOKEN),
// plain local SQLite file when the env vars are absent.
let client: Client | null = null;
let schemaReady: Promise<void> | null = null;

const SEEDS: Record<string, string[]> = {
  categories: ["Main Course", "Soup", "Salad", "Dessert", "Snack", "Drink"],
  cuisines: ["Asian", "Lebanese", "Balkan", "Greek", "Serbian"],
};

function getClient(): Client {
  if (!client) {
    client = createClient(
      process.env.TURSO_DATABASE_URL
        ? {
            url: process.env.TURSO_DATABASE_URL,
            authToken: process.env.TURSO_AUTH_TOKEN,
          }
        : { url: "file:local.db" }
    );
  }
  return client;
}

async function ensureSchema(db: Client): Promise<void> {
  schemaReady ??= (async () => {
    for (const [table, seeds] of Object.entries(SEEDS)) {
      await db.execute(
        `CREATE TABLE IF NOT EXISTS ${table} (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL UNIQUE COLLATE NOCASE,
          created_at TEXT NOT NULL DEFAULT (datetime('now'))
        )`
      );
      const { rows } = await db.execute(`SELECT COUNT(*) AS n FROM ${table}`);
      if (Number(rows[0].n) === 0) {
        for (const name of seeds) {
          await db.execute({
            sql: `INSERT INTO ${table} (name) VALUES (?)`,
            args: [name],
          });
        }
      }
    }
  })();
  return schemaReady;
}

export async function getDb(): Promise<Client> {
  const db = getClient();
  await ensureSchema(db);
  return db;
}
