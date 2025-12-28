import {getDB} from "@/db";
import {NextResponse} from "next/server";

export async function GET(req: Request){

    const db = await getDB();

    try {
        const posts = await db.all(`
            SELECT
                posts.id,
                posts.content,
                posts.image_path,
                posts.created_at,
                users.id AS author_id,
                users.name AS author_name,
                COUNT(post_likes.id) AS likes_count
            FROM posts
                     JOIN users ON users.id = posts.user_id
                     LEFT JOIN post_likes ON post_likes.post_id = posts.id
            WHERE posts.is_deleted = 0
            GROUP BY posts.id
            ORDER BY posts.created_at DESC
        `);
        return NextResponse.json(posts);
    }catch(err){
        return NextResponse.json({ message: "Something went wrong" });
    }finally {
        await db.close();
    }

}