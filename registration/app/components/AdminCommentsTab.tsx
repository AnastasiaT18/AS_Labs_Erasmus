"use client";

import { useEffect, useState } from "react";

type Comment = {
    id: number;
    content: string;
    author_name: string;
    created_at: string;
};

export default function AdminCommentsTab() {
    const [comments, setComments] = useState<Comment[]>([]);
    const [error, setError] = useState<string | null>(null);


    async function loadComments() {
        try {
            setError(null);

            const res = await fetch("/api/comments/list?all=true");

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || "Failed to load comments");
                setComments([]);
                return;
            }

            setComments(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Network error:", err);
            setError("Network error while loading comments");
        }
    }

    async function deleteComment(id: number) {
        if (!confirm("Delete this comment?")) return;
        const res = await fetch("/api/comments/delete", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ commentId: id }),
        });
        if (res.ok) loadComments();
        else alert("Failed to delete comment");
    }

    useEffect(() => {
        loadComments();
    }, []);

    return (

        <>
        {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded">
                {error}
            </div>
        )}

        <table className="w-full text-left border">
            <thead>
            <tr className="bg-gray-100">
                <th className="p-2">ID</th>
                <th className="p-2">Author</th>
                <th className="p-2">Content</th>
                <th className="p-2">Created</th>
                <th className="p-2">Actions</th>
            </tr>
            </thead>
            <tbody>
            {comments.map((c) => (
                <tr key={c.id} className="border-t">
                    <td className="p-2">{c.id}</td>
                    <td className="p-2">{c.author_name}</td>
                    <td className="p-2">{c.content}</td>
                    <td className="p-2">{new Date(c.created_at).toLocaleString()}</td>
                    <td className="p-2">
                        <button
                            onClick={() => deleteComment(c.id)}
                            className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 transition"
                        >
                            Delete
                        </button>
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
        </>
    );

}
