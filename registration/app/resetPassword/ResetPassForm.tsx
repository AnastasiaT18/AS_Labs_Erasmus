"use client";

import { useState } from "react";
import {useSearchParams} from "next/navigation";



export default function ResetPassForm() {

    const searchParams = useSearchParams();
    const token = searchParams.get("token"); // 👈 token from URL

    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");

    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);


    const validate = () => {
        if (password.length < 8) return "Password must be at least 8 characters.";

        if (password != passwordConfirm) return "Passwords are not matching. Try again.";

        return null;
    };


    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();


        const validationError =  validate();

        if (validationError) {
            setError(validationError);
            setSuccess(null);
            console.log(error);
            return;
        }

        setLoading(true);
        setError(null);
        setSuccess(null);

        try{
            //only after validation AND PASS = PASS CONF

            const res = await fetch("/api/resetPassword", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({token, password})
            });


            const data = await res.json();
            console.log(data);

            if (!res.ok){
                setError(data.error || "Something went wrong.");
            }else{
                setSuccess("Reset successful.")
                setPasswordConfirm("");
                setPassword("");
            }
        }catch(err){
            setError("Network error: " + err);
        }

        setLoading(false);
    }


    return (
        <form onSubmit={handleSubmit}>
            {/* PASSWORD */}
            <div className="flex flex-col">
                <label className="font-medium mb-1 text-black">Password</label>
                <input
                    type = "password"
                    className="w-full p-3 border rounded-lg focus:ring-2 mb-4 text-gray-700"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="example@mail.com"
                />
            </div>

            {/* PASSWORD CONFIRMATION*/}
            <div className="flex flex-col">
                <label className="font-medium mb-1 text-black">Password Confirmation</label>
                <input
                    type = "password"
                    className="w-full p-3 border rounded-lg focus:ring-2 mb-4 text-gray-700"
                    value={passwordConfirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
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
                {loading ? "Resetting password..." : "Reset Password"}
            </button>

            {success && (
                <div className="text-green-600 mt-3">
                    {success}
                    <button
                        onClick={() => window.location.href = "/login"}
                        className="ml-2 underline text-blue-600"
                    >
                        Go to Login
                    </button>
                </div>
            )}

        </form>

    );
}