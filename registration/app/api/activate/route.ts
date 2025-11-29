import { getDB } from "@/db";

interface DBUser {
    id: number;
    name: string;
    email: string;
    password_hash: string;
    activation_token: string | null;
    is_active: number;
    created_at?: string;
}

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
        return new Response("Token missing", { status: 400 });
    }

    const db = await getDB();

    try {
        console.log("Looking for user with token...");

        // Promise-free, directly await
        const user: DBUser | undefined = await db.get(
            "SELECT * FROM users WHERE activation_token = ?",
            token
        );

        if (!user) {
            return new Response("Invalid or expired token.", { status: 400 });
        }

        console.log("Found user");

        await db.run(
            "UPDATE users SET is_active = 1, activation_token = NULL WHERE id = ?",
            user.id
        );

        return new Response(
            `<h1>Account activated!</h1><p>You may now log in.</p>`,
            { status: 200, headers: { "Content-Type": "text/html" } }
        );
    } catch (err) {
        console.error(err);
        return new Response("Internal server error", { status: 500 });
    } finally {
        await db.close();
        console.log("✅ DB closed");
    }
}
