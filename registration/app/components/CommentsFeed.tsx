"use client"

import {useEffect, useState} from "react";

type Comment = {
    id: number;
    content: string;
    author_name: string;
    created_at: string;
};

type Props = {
    postId: number,
    user: { id: number; name: string; email: string; role: string } | null;
};


export default function CommentsFeed({ postId, user }: Props) {

    const [comments, setComments] = useState<Comment[]>([]);

    async function loadComments() {
        const res = await fetch(`/api/comments/list?postId=${postId}`);
        const comments = await res.json();
        setComments(comments);
    }

    async function deleteComment(id: number) {
        if (!confirm("Are you sure you want to delete this comment?")) return;

        const res = await fetch(`/api/comments/delete`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ commentId: id }),
        });

        if (res.ok) {
            // remove deleted post from state
            loadComments()
            console.log("Deleting the comment")
        } else {
            const data = await res.json();
            alert(data.error || "Failed to delete comment.");
        }
    }

    useEffect(() => {
        loadComments();
    }, [postId]);

    return (
        <div className="mt-4 space-y-3">
            {comments.map((comment) => (
                <div
                    key={comment.id}
                    className="bg-white border border-gray-200 rounded-xl px-4 py-3
                               hover:bg-gray-50 transition"
                >
                    {/* Header */}
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-gray-800">
                            {comment.author_name}
                        </span>
                        <span className="text-xs text-gray-400">
                            {new Date(comment.created_at).toLocaleString()}
                        </span>
                    </div>

                    {/* Content */}
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">
                        {comment.content}
                    </p>

                    {/* Actions */}
                    {(user?.role === "admin" ||
                        user?.name === comment.author_name) && (
                        <div className="flex justify-end mt-2">
                            <button
                                onClick={() => deleteComment(comment.id)}
                                className="text-xs text-red-500 hover:text-red-700 transition"
                            >
                                Delete
                            </button>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}