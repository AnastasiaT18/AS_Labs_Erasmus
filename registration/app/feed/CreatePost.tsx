"use client"

import {useState} from "react";


export default function CreatePost() {

    const [content, setContent] = useState("");
    const [image, setImage] = useState<File | null>(null);


    async function createPost(e: React.FormEvent) {
        e.preventDefault();

        const formData = new FormData();
        formData.append("content", content);
        if (image) {
            formData.append("image", image);
        }

        const res = await fetch("/api/posts/create", {
            method: "POST",
            body: formData
        })

        if (res.ok) {
            setContent("");
            setImage(null);
            window.location.reload();
        }else{
            alert("Failed to create post");
        }
    }


    return (
        <form
            onSubmit={createPost}
            className="bg-white p-4 rounded-lg shadow space-y-4"
        >
      <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          maxLength={500}
          placeholder="Write something..."
          required
          className="w-full p-3 border-1 border-gray-300 rounded-lg text-black"
      />

            <input
                type="file"
                accept="image/png,image/jpeg"
                onChange={(e) => setImage(e.target.files?.[0] || null)}
                className="block text-gray-700 text-sm"
            />

            <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-medium"
            >
                Post
            </button>
        </form>
    );
}