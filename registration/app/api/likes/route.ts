import {getAuthenticatedUser} from "@/app/lib/auth";
import {NextResponse} from "next/server";
import {getDB} from "@/db";

export async function POST(req: Request) {

    const user = await getAuthenticatedUser();
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    if (!body) {
        return NextResponse.json({ error: "Post ID required" }, { status: 400 });
    }
    const postId = Number(body.postId);


    const db = await getDB();

    try{
        console.log("Trying to like...");
        //get if liked or not
        const existing = await db.get(
            "SELECT * FROM post_likes WHERE user_id = ? AND post_id = ?",
            [user.id, postId]
        )
        console.log("[LIKE] Existing like:", !!existing);


        if (existing) {
            //user unliked the post
            await db.run(
                "DELETE FROM post_likes WHERE user_id = ? AND post_id = ?",
                [user.id, postId]
            )
            console.log("Unliked")
            return NextResponse.json({ liked: false });
        }

        else{
            //user liked post
            await db.run(
                "INSERT INTO post_likes (post_id, user_id) VALUES (?, ?) ",
                [postId, user.id]
            )
            console.log("Liked")

            return NextResponse.json({ liked: true });
        }

    }catch(err){
        console.error("[LIKE] ERROR:", err);
        return NextResponse.json(
            { error: "Internal server error", details: String(err) },
            { status: 500 }
        );
    }finally{
        await db.close();
    }
}