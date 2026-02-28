import Database from "better-sqlite3";
import path from "path";

function createDatabase(): Database.Database {
  const dbPath = path.join(process.cwd(), "data", "holidays.db");

  // Ensure data directory exists
  const fs = require("fs");
  const dir = path.dirname(dbPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const db = new Database(dbPath);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");

  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE COLLATE NOCASE
    );

    CREATE TABLE IF NOT EXISTS holidays (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL,
      name TEXT NOT NULL,
      type TEXT NOT NULL CHECK(type IN ('national', 'company', 'pto', 'event')),
      user_name TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      UNIQUE(date, type, user_name)
    );
  `);

  // Migrate: update CHECK constraint to include 'event' type if needed
  const tableInfo = db.prepare("SELECT sql FROM sqlite_master WHERE name = 'holidays'").get() as { sql: string } | undefined;
  if (tableInfo && !tableInfo.sql.includes("'event'")) {
    db.exec(`
      CREATE TABLE holidays_new (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT NOT NULL,
        name TEXT NOT NULL,
        type TEXT NOT NULL CHECK(type IN ('national', 'company', 'pto', 'event')),
        user_name TEXT,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        UNIQUE(date, type, user_name)
      );
      INSERT INTO holidays_new SELECT * FROM holidays;
      DROP TABLE holidays;
      ALTER TABLE holidays_new RENAME TO holidays;
    `);
  }

  return db;
}

// Use globalThis to survive HMR in dev
const globalForDb = globalThis as unknown as { _db?: Database.Database };

export function getDb(): Database.Database {
  if (!globalForDb._db) {
    globalForDb._db = createDatabase();
  }
  return globalForDb._db;
}
