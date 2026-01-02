import {getDB} from "@/db";
import {NextResponse} from "next/server";
import {getAuthenticatedUser} from "@/app/lib/auth";

export async function DELETE(req: Request){

    const user = await getAuthenticatedUser();
    if (!user || user.role !== "admin") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {userId} = await req.json();
    if (!userId) {
        return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const db = await getDB();

    if (user.id === userId){
        return NextResponse.json(
            {
                error: "SELF_DELETE_FORBIDDEN",
                message: "Administrators cannot delete their own account.",
            },
            { status: 400 }
        );
    }

    try {
        await db.run("DELETE FROM users WHERE id = ?", [userId]);
        return NextResponse.json({ success: true });
    }catch(err){
        return NextResponse.json({ error: String(err) }, { status: 500 });
    }
    finally {
        await db.close();
    }
}