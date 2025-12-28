// import { getDB } from "./db"; // your getDB.ts from before

// View all users
import {getDB} from "./db.js";
import bcrypt from "bcryptjs";
import * as dotenv from "dotenv";
dotenv.config();

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

//VIEW POSTS
export async function viewPosts() {
    const db = await getDB();
    try {
        const sessions = await db.all(
            "SELECT * FROM posts"
        );
        console.table(sessions);
        return sessions;
    } catch (err) {
        console.error(" Error fetching posts:", err);
    } finally {
        await db.close();
        console.log(" DB closed");
    }
}

// Delete all posts
export async function deleteAllPosts() {
    const db = await getDB();
    try {
        await db.run("DELETE FROM posts");
        console.log(" All posts deleted");
    } catch (err) {
        console.error(" Error deleting posts:", err);
    } finally {
        await db.close();
        console.log(" DB closed");
    }
}

//VIEW COMMENTS
export async function viewComments() {
    const db = await getDB();
    try {
        const sessions = await db.all(
            "SELECT * FROM comments"
        );
        console.table(sessions);
        return sessions;
    } catch (err) {
        console.error(" Error fetching comments:", err);
    } finally {
        await db.close();
        console.log(" DB closed");
    }
}

//VIEW LIKES
export async function viewLikes() {
    const db = await getDB();
    try {
        const sessions = await db.all(
            "SELECT * FROM post_likes"
        );
        console.table(sessions);
        return sessions;
    } catch (err) {
        console.error(" Error fetching likes:", err);
    } finally {
        await db.close();
        console.log(" DB closed");
    }
}

// Delete all comments
export async function deleteAllComments() {
    const db = await getDB();
    try {
        await db.run("DELETE FROM comments");
        console.log(" All comments deleted");
    } catch (err) {
        console.error(" Error deleting comments:", err);
    } finally {
        await db.close();
        console.log(" DB closed");
    }
}

export async function addAdminUser() {
    const db = await getDB();

    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;
    const name = process.env.ADMIN_NAME || "Admin";

    if (!email || !password) {
        console.error("ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env");
        return;
    }
    try {
        const passwordHash = await bcrypt.hash(password, 10);

        await db.run(
            `INSERT INTO users (name, email, password_hash, is_active, role)
             VALUES (?, ?, ?, 1, 'admin')`,
            name,
            email,
            passwordHash
        );

        console.log(`Admin user ${name} (${email}) created successfully.`);

    }catch (err) {
        console.error("Error creating admin user:", err);
    } finally {
        await db.close();
        console.log("DB closed");
    }

}

// Delete all users
export async function deleteAdmin() {
    const db = await getDB();
    try {
        const adminEmail = process.env.ADMIN_EMAIL;
        await db.run("DELETE FROM users WHERE email = ?", adminEmail);        console.log(" Admin deleted");
    } catch (err) {
        console.error(" Error deleting admin:", err);
    } finally {
        await db.close();
        console.log(" DB closed");
    }
}

// Example usage:
(async () => {
    await viewUsers();
    await viewSessions();
    await viewPosts();

    await viewComments();

    await viewLikes();

    // await deleteAllUsers();
    // await deleteAllSessions()
    // await deleteAllPosts();
    // await deleteAllComments();

    // await viewResets();
    //
    // await addAdminUser();
    // await deleteAdmin()

    // await deleteAllResets();
})();
