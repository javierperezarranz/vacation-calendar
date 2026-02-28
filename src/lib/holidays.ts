import { getDb } from "./db";
import { Holiday, User } from "./types";

export function getHolidaysForYear(year: number): Holiday[] {
  const db = getDb();
  const startDate = `${year}-01-01`;
  const endDate = `${year}-12-31`;
  return db
    .prepare(
      "SELECT * FROM holidays WHERE date >= ? AND date <= ? ORDER BY date"
    )
    .all(startDate, endDate) as Holiday[];
}

export function getPtoCountsForYear(
  year: number
): Record<string, number> {
  const db = getDb();
  const startDate = `${year}-01-01`;
  const endDate = `${year}-12-31`;
  const rows = db
    .prepare(
      `SELECT user_name, COUNT(*) as count FROM holidays
       WHERE date >= ? AND date <= ? AND type = 'pto' AND user_name IS NOT NULL
         AND strftime('%w', date) NOT IN ('0', '6')
         AND date NOT IN (
           SELECT date FROM holidays WHERE date >= ? AND date <= ? AND type = 'national'
         )
       GROUP BY user_name`
    )
    .all(startDate, endDate, startDate, endDate) as { user_name: string; count: number }[];

  const counts: Record<string, number> = {};
  for (const row of rows) {
    counts[row.user_name] = row.count;
  }
  return counts;
}

export function createHolidays(
  dates: string[],
  name: string,
  type: string,
  userNames: string[]
): Holiday[] {
  const db = getDb();

  const ensureUser = db.prepare("INSERT OR IGNORE INTO users (name) VALUES (?)");
  const insert = db.prepare(
    "INSERT OR IGNORE INTO holidays (date, name, type, user_name) VALUES (?, ?, ?, ?)"
  );

  const insertAll = db.transaction(() => {
    for (const userName of userNames) {
      ensureUser.run(userName);
      for (const date of dates) {
        insert.run(date, name, type, userName);
      }
    }
  });

  insertAll();

  // Return the created holidays
  const datePlaceholders = dates.map(() => "?").join(",");
  const userPlaceholders = userNames.map(() => "?").join(",");
  return db
    .prepare(
      `SELECT * FROM holidays WHERE date IN (${datePlaceholders}) AND type = ? AND user_name IN (${userPlaceholders})`
    )
    .all(...dates, type, ...userNames) as Holiday[];
}

export function deleteHoliday(id: number): boolean {
  const db = getDb();
  const result = db.prepare("DELETE FROM holidays WHERE id = ?").run(id);
  return result.changes > 0;
}

export function getUsers(): User[] {
  const db = getDb();
  return db.prepare("SELECT * FROM users ORDER BY name").all() as User[];
}
