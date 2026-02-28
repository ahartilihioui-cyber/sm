import initSqlJs, { Database as SqlJsDatabase } from "sql.js";
import fs from "fs";
import path from "path";

let db: SqlJsDatabase | null = null;
let SQL: Awaited<ReturnType<typeof initSqlJs>> | null = null;

const DB_PATH = path.join(process.cwd(), "database.sqlite");
const isVercel = process.env.VERCEL === "1";

async function getDb(): Promise<SqlJsDatabase> {
  if (db) return db;

  // Try multiple locations for the WASM binary
  let wasmBinary: Buffer | undefined;
  const possiblePaths = [
    path.join(process.cwd(), "node_modules", "sql.js", "dist", "sql-wasm.wasm"),
    path.join(__dirname, "..", "node_modules", "sql.js", "dist", "sql-wasm.wasm"),
    path.join(process.cwd(), "sql-wasm.wasm"),
  ];

  for (const p of possiblePaths) {
    try {
      if (fs.existsSync(p)) {
        wasmBinary = fs.readFileSync(p);
        break;
      }
    } catch {
      // try next path
    }
  }

  // If no local file found (e.g. Vercel), fetch from CDN
  if (!wasmBinary) {
    const response = await fetch("https://sql.js.org/dist/sql-wasm.wasm");
    const arrayBuffer = await response.arrayBuffer();
    wasmBinary = Buffer.from(arrayBuffer);
  }

  SQL = await initSqlJs({ wasmBinary });

  // In local dev, persist to file; on Vercel, use in-memory
  if (!isVercel && fs.existsSync(DB_PATH)) {
    const buffer = fs.readFileSync(DB_PATH);
    db = new SQL.Database(buffer);
  } else {
    db = new SQL.Database();
  }

  initializeDatabase(db);
  return db;
}

function saveDb() {
  if (db && !isVercel) {
    try {
      const data = db.export();
      const buffer = Buffer.from(data);
      fs.writeFileSync(DB_PATH, buffer);
    } catch {
      // Ignore write errors in read-only environments
    }
  }
}

function initializeDatabase(database: SqlJsDatabase) {
  database.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'admin',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  database.run(`
    CREATE TABLE IF NOT EXISTS students (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      date_of_birth TEXT,
      gender TEXT,
      phone TEXT,
      address TEXT,
      enrollment_date TEXT DEFAULT (date('now')),
      program TEXT,
      year_level INTEGER DEFAULT 1,
      status TEXT DEFAULT 'active',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  database.run(`
    CREATE TABLE IF NOT EXISTS cars (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      brand TEXT NOT NULL,
      model TEXT NOT NULL,
      year INTEGER NOT NULL,
      color TEXT,
      license_plate TEXT UNIQUE,
      mileage INTEGER DEFAULT 0,
      fuel_type TEXT DEFAULT 'essence',
      transmission TEXT DEFAULT 'manuelle',
      price REAL,
      doors INTEGER DEFAULT 4,
      horsepower INTEGER,
      description TEXT,
      status TEXT DEFAULT 'disponible',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Seed default admin user if none exists (password: admin123)
  const result = database.exec("SELECT COUNT(*) as count FROM users");
  const userCount = result[0]?.values[0]?.[0] as number;

  if (userCount === 0) {
    const bcrypt = require("bcryptjs");
    const hashedPassword = bcrypt.hashSync("admin123", 10);
    database.run(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      ["Admin", "admin@school.com", hashedPassword, "admin"]
    );
    saveDb();
  }
}

// Helper functions to match better-sqlite3-style API
export function dbAll(sql: string, ...params: unknown[]): Record<string, unknown>[] {
  const database = dbSync();
  const stmt = database.prepare(sql);
  if (params.length > 0) {
    stmt.bind(params.flat());
  }
  const rows: Record<string, unknown>[] = [];
  while (stmt.step()) {
    rows.push(stmt.getAsObject() as Record<string, unknown>);
  }
  stmt.free();
  return rows;
}

export function dbGet(sql: string, ...params: unknown[]): Record<string, unknown> | undefined {
  const rows = dbAll(sql, ...params);
  return rows[0];
}

export function dbRun(sql: string, ...params: unknown[]): { lastInsertRowid: number; changes: number } {
  const database = dbSync();
  database.run(sql, params.flat() as unknown[]);
  const lastId = (database.exec("SELECT last_insert_rowid() as id")[0]?.values[0]?.[0] ?? 0) as number;
  const changes = (database.exec("SELECT changes() as c")[0]?.values[0]?.[0] ?? 0) as number;
  saveDb();
  return { lastInsertRowid: lastId, changes };
}

// Synchronous getter - uses cached db
function dbSync(): SqlJsDatabase {
  if (!db) {
    throw new Error("Database not initialized. Call getDb() first.");
  }
  return db;
}

export default getDb;
