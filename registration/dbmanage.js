// import { getDB } from "./db"; // your getDB.ts from before

// View all users
import {getDB} from "./db.js";

export async function viewUsers() {
    const db = await getDB();
    try {
        const users = await db.all(
            "SELECT * FROM users"
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

//VIEW SESSIONS
export async function viewSessions() {
    const db = await getDB();
    try {
        const sessions = await db.all(
            "SELECT * FROM sessions"
        );
        console.table(sessions);
        return sessions;
    } catch (err) {
        console.error(" Error fetching sessions:", err);
    } finally {
        await db.close();
        console.log(" DB closed");
    }
}

// Delete all sessions
export async function deleteAllSessions() {
    const db = await getDB();
    try {
        await db.run("DELETE FROM sessions");
        console.log(" All sessions deleted");
    } catch (err) {
        console.error(" Error deleting users:", err);
    } finally {
        await db.close();
        console.log(" DB closed");
    }
}

//VIEW RESETS
export async function viewResets() {
    const db = await getDB();
    try {
        const sessions = await db.all(
            "SELECT * FROM passwordResetTokens"
        );
        console.table(sessions);
        return sessions;
    } catch (err) {
        console.error(" Error fetching sessions:", err);
    } finally {
        await db.close();
        console.log(" DB closed");
    }
}

// Delete all resets
export async function deleteAllResets() {
    const db = await getDB();
    try {
        await db.run("DELETE FROM passwordResetTokens");
        console.log(" All sessions deleted");
    } catch (err) {
        console.error(" Error deleting users:", err);
    } finally {
        await db.close();
        console.log(" DB closed");
    }
}

// Example usage:
(async () => {
    await viewUsers();
    await viewSessions();

    // await deleteAllUsers();
    // await deleteAllSessions()

    await viewResets();

    // await deleteAllResets();
})();
