"use client"

import {useEffect, useState} from "react";
import CreateCommentForm from "@/app/components/CreateCommentForm";
import CommentsFeed from "@/app/components/CommentsFeed";
import SearchBar from "@/app/components/SearchBar";

type Post = {
    id: number;
    content: string;
    image_path: string | null;
    author_name: string;
    created_at: string;
    likes_count: number;
};

type Props = {
    user: { id: number; name: string; email: string; role: string } | null;
};

export default function PostsFeed({ user }: Props) {

    const [posts, setPosts] = useState<Post[]>([]);

    async function loadPosts(query?: string) {
        const url = query
            ? `/api/posts/search?q=${encodeURIComponent(query)}`
            : "/api/posts/list";

        const res = await fetch(url);
        const posts = await res.json();

        if (Array.isArray(posts)) {
            setPosts(posts);
        } else {
            console.warn("Posts API returned non-array:", posts);
            setPosts([]);
        }
    }

    async function deletePost(id: number) {
        if (!confirm("Are you sure you want to delete this post?")) return;

        const res = await fetch(`/api/posts/delete`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ postId: id }),
        });

        if (res.ok) {
            // remove deleted post from state
            loadPosts()
            console.log("Deleting the post")
        } else {
            const data = await res.json();
            alert(data.error || "Failed to delete post.");
        }
    }

    async function likePost(id: number) {
        const res = await fetch("/api/likes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ postId: id }),
            });
        if (res.ok) {
            loadPosts();
        }
    }

    useEffect(() => {
        loadPosts();
    }, []);


    return (
        <div className="space-y-6">
            {/* SEARCH BAR */}
            <SearchBar onSearch={loadPosts} />

            {/* EMPTY STATE */}
            {posts.length === 0 && (
                <div className="text-center text-gray-500 py-10">
                    No posts found.
                </div>
            )}

            {posts.map((post) => (
                <div
                    key={post.id}
                    className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition"
                >
                    {/* Author and timestamp */}
                    <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold text-gray-800">
                          {post.author_name}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(post.created_at).toLocaleString()}
                        </span>
                    </div>

                    {/* Content */}
                    <p className="text-gray-700 mb-2 whitespace-pre-wrap">{post.content}</p>

                    {/* Image */}
                    {post.image_path && (
                        <img
                            src={post.image_path}
                            alt="post"
                            className="w-full rounded-lg object-cover max-h-80"
                        />
                    )}

                    <div>
                        {user ? ( <button
                            onClick={() => likePost(post.id)}
                            className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-500 transition"
                        >
                            ❤️{post.likes_count}
                        </button>)
                        : (
                                <span>❤️</span>
                            )}
                        <span>{post.likes_count}</span>
                    </div>




                    {/* Comments */}
                    <CommentsFeed postId={post.id} user={user}/>

                    {/* Comment form */}
                    {user && <CreateCommentForm postId={post.id}/>}


                    {/* Other buttons (including delete) */}
                    {(user?.role === "admin" || user?.name === post.author_name) && (
                        <button
                            type="submit"
                            onClick={() => deletePost(post.id)}
                            className="bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition font-medium"
                        >
                            Delete
                        </button>)}
                </div>
            ))}
        </div>
    );
}