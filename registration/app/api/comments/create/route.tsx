import {getAuthenticatedUser} from "@/app/lib/auth";
import {NextResponse} from "next/server";
import {getDB} from "@/db";


export async function POST(req: Request){

    const user = await getAuthenticatedUser();

    if (!user) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
        );
    }

    const { postId, content } = await req.json();


    if (!postId || !content) {
        return NextResponse.json({ error: "Post ID and content required" }, { status: 400 });
    }

    //if ok then post
    const db = await getDB();

    try {
        console.log("posting comment...");
        await db.run(
            "INSERT INTO comments(post_id, user_id, content) VALUES (?, ?, ?)",
            [postId, user.id, content],
        );
    }catch (err: any) {
        return NextResponse.json(
            { error: err.message || "Failed to create comment" },
            { status: 500 }
        );
    }
    finally {
        await db.close();
    }
    console.log("Comment added successfully");
    return NextResponse.json({ message: "Comment added" });
}