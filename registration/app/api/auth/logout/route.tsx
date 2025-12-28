import {getDB} from "@/db";
import {NextResponse} from "next/server";


export async function POST(req: Request){
    let db;

    try{
        const db = await getDB();

        // Get cookie from request
        const cookieHeader = req.headers.get("cookie");
        const sessionToken = cookieHeader?.split("session=")[1]?.split(";")[0];

        if (sessionToken) {
            // Delete session from DB
            await db.run("DELETE FROM sessions WHERE session_token = ?", sessionToken);
        }

        // Clear cookie
        const response = NextResponse.json({ message: "Logged out" });
        response.cookies.set("session", "", { maxAge: 0, path: "/" });

        return response;
    }catch(err){
        console.error(err);
        return NextResponse.json({ error: "Could not log out" }, { status: 500 });
    } finally {
        if (db) { // @ts-ignore
            await db.close();
        }
    }

}
