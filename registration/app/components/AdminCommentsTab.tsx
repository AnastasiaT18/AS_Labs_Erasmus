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

    async function loadComments() {
        const res = await fetch("/api/comments/list?all=true"); // maybe add ?all=true to get all comments
        const data = await res.json();
        setComments(Array.isArray(data) ? data : []);
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
    );
}
