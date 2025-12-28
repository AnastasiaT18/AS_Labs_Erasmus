import {getDB} from "@/db";
import {NextResponse} from "next/server";
import {getAuthenticatedUser} from "@/app/lib/auth";

export async function GET(req: Request){

    const user = await getAuthenticatedUser();
    if (!user || user.role !== "admin") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = await getDB();

    try {
        const users = await db.all("SELECT id, name, email, role FROM users");
        return NextResponse.json(users);
    }catch(err){
        return NextResponse.json(
            { error: "Failed to load users from database", details: String(err) },
            { status: 500 }
        );
    }
    finally {
        await db.close();
    }
}