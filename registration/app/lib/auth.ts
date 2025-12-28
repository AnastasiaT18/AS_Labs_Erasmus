import {cookies} from "next/headers";
import {getDB} from "@/db";


export type AuthUser = {
    id: number;
    name: string;
    email: string;
    role: string;
};


export async function getAuthenticatedUser(): Promise<AuthUser | null>{
    // read cookie
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("session")?.value;

    if (!sessionToken) {
        console.log("No session token found in cookies.");
        return null;
    }

    // lookup session
    const db = await getDB();
    try{
        const session = await db.get(
            `
          SELECT users.id, users.email, users.name, users.role, sessions.expires_at
          FROM sessions
          JOIN users ON users.id = sessions.user_id
          WHERE sessions.session_token = ?
          `,
            sessionToken
        );

        if (!session) {
            console.log("Session not found or invalid.");
            return null;
        }

        // Check expiration
        const now = new Date();
        const expiresAt = new Date(session.expires_at);

        if (expiresAt < now) {
            // Session expired → cleanup
            console.log("Session expired. Cleaning up...");
            await db.run(
                "DELETE FROM sessions WHERE session_token = ?",
                sessionToken
            );
            return null;
        }

        // return user or null

        return {
            id: session.id,
            name: session.name,
            email: session.email,
            role: session.role,
        };
    }catch(err: any){
        console.error("Error retrieving authenticated user:", err.message || err);
        return null;
    }
    finally {
    await db.close();
    }
}