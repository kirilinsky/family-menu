import "server-only";
import { createClient, type Client } from "@libsql/client";

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
    await db.execute(
      `CREATE TABLE IF NOT EXISTS dishes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT NOT NULL CHECK (type IN ('domestic', 'travel')),
        name TEXT NOT NULL,
        country TEXT NOT NULL DEFAULT '',
        city TEXT,
        category TEXT NOT NULL DEFAULT '',
        cuisines TEXT NOT NULL DEFAULT '[]',
        ingredients TEXT NOT NULL DEFAULT '[]',
        rating INTEGER,
        -- created_at = added to the list; tried_on = when it was actually tasted
        -- (set on insert for "tried" dishes, stamped on the want→tried flip later)
        tried_on TEXT,
        comment TEXT,
        link TEXT,
        link_title TEXT,
        image_url TEXT,
        image_prompt TEXT,
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
      )`
    );
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
