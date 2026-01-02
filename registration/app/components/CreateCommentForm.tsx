"use client"

import {useState} from "react";

type Props = {
    postId: number;
};

export default function CreateCommentForm({ postId }: Props) {

    const [content, setContent] = useState("");


    async function createComment(e: React.FormEvent) {
        e.preventDefault();

        const res = await fetch("/api/comments/create", {
            method: "POST",
            body: JSON.stringify({
                postId: postId,
                content: content,
            })
        })

        if (res.ok) {
            setContent("");
            window.location.reload();
            console.log("comment added");
        }else{
            alert("Failed to create comment");
        }
    }

    return (
        <form
            onSubmit={createComment}
            className="mt-3 bg-gray-50 border border-gray-200 rounded-xl p-3 space-y-2"
        >
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                maxLength={500}
                placeholder="Write something nice…"
                required
                className="w-full resize-none rounded-lg border border-gray-300 p-2 text-sm
                           focus:outline-none focus:ring-2 focus:ring-blue-400
                           placeholder:text-gray-400 text-black"
                rows={3}
            />

            <div className="flex justify-end">
                <button
                    type="submit"
                    className="bg-blue-600 text-white text-sm px-4 py-1.5 rounded-lg
                               hover:bg-blue-700 transition font-medium"
                >
                    Post
                </button>
            </div>
        </form>
    );
}