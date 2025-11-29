import sqlite3 from "sqlite3";
import { open } from "sqlite";



async function initDB() {
    const db = await open({
        filename: "./users.db", // this will create users.db
        driver: sqlite3.Database,
    });

    // Create the Users table if it doesn't exist
    await db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      activation_token TEXT,
      is_active BOOLEAN DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

    console.log("DB initialized");
    return db;
}

// Run once to create the database
initDB().catch(err => console.error(err));
