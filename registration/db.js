import { open } from "sqlite";
import sqlite3 from "sqlite3";

// Path to your DB (same as in initDB)
const dbPath = "./users.db"; // assuming this file is also in the registration folder

export async function getDB() {
    try {
        const db = await open({
            filename: dbPath,
            driver: sqlite3.Database,
        });

        console.log(" DB opened successfully");
        return db;
    } catch (err) {
        console.error(" Failed to open DB:", err);
        throw err;
    }
}
