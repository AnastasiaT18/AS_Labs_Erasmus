"use client";

import { useState } from "react";

export default function ResetRequestForm() {

    const [email, setEmail] = useState("");

    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);


    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        setLoading(true);
        setError(null);
        setSuccess(null);

        try{

            const res = await fetch("/api/resetRequest", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({email})
            });


            const data = await res.json();
            console.log(data);

            if (!res.ok){
                setError(data.error || "Something went wrong.");
            }else{
                setSuccess("Request successful! Check your email for the reset link.")
                setEmail("");
            }
        }catch(err){
            setError("Network error: " + err);
        }

        setLoading(false);
    }


    return (
        <form onSubmit={handleSubmit}>
            {/* EMAIL */}
            <div className="flex flex-col">
                <label className="font-medium mb-1 text-black">Email</label>
                <input
                    className="w-full p-3 border rounded-lg focus:ring-2 mb-4 text-gray-700"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@mail.com"
                />
            </div>


            {error && <p className="text-red-600 text-sm">{error}</p>}
            {success && <p className="text-green-600 text-sm">{success}</p>}


            <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 mt-3"
            >
                {loading ? "Sending link..." : "Send Password Reset Link"}
            </button>

        </form>

    );
}