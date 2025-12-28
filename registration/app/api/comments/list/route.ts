import {getDB} from "@/db";
import {NextResponse} from "next/server";

export async function GET(req: Request){

    const db = await getDB();

    const postId = req.url.split("postId=")[1]; // simple query param
    if (!postId) return NextResponse.json({ error: "Post ID required" }, { status: 400 });


    try {
        const comments = await db.all(`
            SELECT 
                comments.*,
                users.name AS author_name
            FROM comments
            JOIN users ON users.id = comments.user_id
            WHERE comments.is_deleted = 0 AND comments.post_id = ?
            ORDER BY comments.created_at DESC
        `, postId);
        return NextResponse.json(comments);
    }catch(err){
        return NextResponse.json({ message: "Something went wrong" });
    }finally {
        await db.close();
    }

}