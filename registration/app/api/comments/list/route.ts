import {getDB} from "@/db";
import {NextResponse} from "next/server";

export async function GET(req: Request){

    const db = await getDB();

    const { searchParams } = new URL(req.url);

    const postId = searchParams.get("postId");
    const all = searchParams.get("all");



    try {

        if (all === "true"){
            const comments = await db.all(`
            SELECT
            comments.*,
                users.name AS author_name,
                posts.content AS post_content
            FROM comments
            JOIN users ON users.id = comments.user_id
            JOIN posts ON posts.id = comments.post_id
            WHERE comments.is_deleted = 0
            ORDER BY comments.created_at DESC
                `);
            return NextResponse.json(comments);
        }

        if (!postId) return NextResponse.json({ error: "Post ID required", message:"Post ID required." }, { status: 400 });

        const comments = await db.all(
            `
            SELECT 
                comments.*,
                users.name AS author_name
            FROM comments
            JOIN users ON users.id = comments.user_id
            WHERE comments.is_deleted = 0
              AND comments.post_id = ?
            ORDER BY comments.created_at DESC
            `,
            postId
        );

        return NextResponse.json(comments);

    }catch(err){

        return NextResponse.json(
            {
                error: "COMMENTS_FETCH_FAILED",
                message: "Failed to fetch comments",
            },
            { status: 500 }
        );
    }finally {
        await db.close();
    }

}