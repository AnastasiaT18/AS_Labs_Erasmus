import { cookies } from "next/headers"; // for server components (App Router)
import { getDB } from "@/db";
import LogoutButton from "@/app/logout/LogoutButton";

export default async function DashboardPage() {

    // 1. Get cookies from request
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("session")?.value;

    if (!sessionToken) {
        // If no session, redirect to login
        return (
            <div>
                <p>You are not logged in. Please <a href="/login" className="text-blue-600">login</a>.</p>
            </div>
        );
    }

    // 2. Look up session in DB
    const db = await getDB();
    const session = await db.get("SELECT * FROM sessions WHERE session_token = ?", [sessionToken]);

    if (!session) {
        return (
            <div>
                <p>Invalid session. Please <a href="/login" className="text-blue-600">login</a>.</p>
            </div>
        );
    }

    // 3. Get user info
    const user = await db.get("SELECT name, email FROM users WHERE id = ?", [session.user_id]);

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold">Welcome, {user.name}!</h1>
            <p>Your email: {user.email}</p>
            <LogoutButton />
        </div>
    );
}
