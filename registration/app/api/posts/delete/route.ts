import {getAuthenticatedUser} from "@/app/lib/auth";
import {NextResponse} from "next/server";
import {getDB} from "@/db";

export async function DELETE(req: Request)  {

    const user = await getAuthenticatedUser();

    if (!user) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
        );
    }

    const { postId } = await req.json();

    if (!postId) {
        return NextResponse.json(
            { error: "Invalid post id" },
            { status: 400 }
        );
    }

    const db = await getDB();

    try {

        const post = await db.get(
            "SELECT user_id FROM posts WHERE id = ? AND is_deleted = 0",
            postId
        )

        if (!post) {
            return NextResponse.json(
                { error: "Post not found" },
                { status: 404 }
            );
        }

        // ownership / admin check
        if (post.user_id !== user.id && user.role !== "admin") {
            return NextResponse.json(
                { error: "Forbidden" },
                { status: 403 }
            );
        }

        await db.run(
            "UPDATE posts SET is_deleted = 1 WHERE id = ?",
            postId
        );

        return NextResponse.json({ message: "Post deleted" });
    }catch(error)
    {
        return NextResponse.json({ message: "Something went wrong" });
    }
    finally {
        await db.close();
    }

}
