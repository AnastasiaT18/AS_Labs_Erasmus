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

    const { commentId } = await req.json();

    if (!commentId) {
        return NextResponse.json(
            { error: "Invalid comment id" },
            { status: 400 }
        );
    }

    const db = await getDB();

    try {

        const comment = await db.get(
            "SELECT user_id FROM comments WHERE id = ? AND is_deleted = 0",
            commentId
        )

        if (!comment) {
            return NextResponse.json(
                { error: "Comment not found" },
                { status: 404 }
            );
        }

        // ownership / admin check
        if (comment.user_id !== user.id && user.role !== "admin") {
            return NextResponse.json(
                { error: "Forbidden" },
                { status: 403 }
            );
        }

        await db.run(
            "UPDATE comments SET is_deleted = 1 WHERE id = ?",
            commentId
        );

        return NextResponse.json({ message: "Comment deleted" });
    }catch(error)
    {
        return NextResponse.json({ message: "Something went wrong" });
    }
    finally {
        await db.close();
    }

}
