import { getDB } from "@/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const url = new URL(req.url);
    const query = url.searchParams.get("q") || "";

    const db = await getDB();

    try {
        const posts = await db.all(
            `
      SELECT posts.id, posts.content, posts.image_path, posts.created_at,
             users.id AS author_id, users.name AS author_name,
             COUNT(post_likes.id) AS likes_count
      FROM posts
      JOIN users ON users.id = posts.user_id
      LEFT JOIN post_likes ON post_likes.post_id = posts.id
      WHERE posts.is_deleted = 0 AND (posts.content LIKE ? OR users.name LIKE ?)
      GROUP BY posts.id
      ORDER BY posts.created_at DESC
      `,
            [`%${query}%`, `%${query}%`]
        );

        return NextResponse.json(posts);
    } catch (err) {
        return NextResponse.json({ error: "Failed to search posts" }, { status: 500 });
    } finally {
        await db.close();
    }
}
