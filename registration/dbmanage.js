// import { getDB } from "./db"; // your getDB.ts from before

// View all users
import {getDB} from "./db.js";

export async function viewUsers() {
    const db = await getDB();
    try {
        const users = await db.all(
            "SELECT id, name, email, is_active, created_at FROM users"
        );
        console.table(users);
        return users;
    } catch (err) {
        console.error(" Error fetching users:", err);
    } finally {
        await db.close();
        console.log(" DB closed");
    }
}

// Delete all users
export async function deleteAllUsers() {
    const db = await getDB();
    try {
        await db.run("DELETE FROM users");
        console.log(" All users deleted");
    } catch (err) {
        console.error(" Error deleting users:", err);
    } finally {
        await db.close();
        console.log(" DB closed");
    }
}

// Example usage:
(async () => {
    // await viewUsers();
    // await deleteAllUsers();
    await viewUsers();
})();
