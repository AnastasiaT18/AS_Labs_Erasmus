"use client";

import { useEffect, useState } from "react";

type Post = {
    id: number;
    content: string;
    author_name: string;
    created_at: string;
};


export default function AdminPostsTab() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(false);

    async function loadPosts() {
        setLoading(true);
        const res = await fetch("/api/posts/list");
        const data = await res.json();
        setPosts(Array.isArray(data) ? data : []);
        setLoading(false);
    }

    async function deletePost(postId: number) {
        if (!confirm("Delete this post?")) return;
        const res = await fetch("/api/posts/delete", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ postId }),
        });
        if (!res.ok) {
            const err = await res.json();
            alert(err.message || err.error || "Failed to delete post");
            return;
        }
        loadPosts();

    }

    useEffect(() => {
        loadPosts();
    }, []);

    if (loading) return <p>Loading posts...</p>;

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
            {posts.map((p) => (
                <tr key={p.id} className="border-t">
                    <td className="p-2">{p.id}</td>
                    <td className="p-2">{p.author_name}</td>
                    <td className="p-2">{p.content}</td>
                    <td className="p-2">{new Date(p.created_at).toLocaleString()}</td>
                    <td className="p-2">
                        <button
                            onClick={() => deletePost(p.id)}
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