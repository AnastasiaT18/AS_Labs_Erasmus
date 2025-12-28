"use client";

import { useState } from "react";

export default function RegisterForm() {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [email, setEmail] = useState("");

    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);


    const validate = () => {
        if (username.length < 2) return "Username must be at least 2 characters.";
        if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) return "Invalid email.";
        if (password.length < 8) return "Password must be at least 8 characters.";
        if (passwordConfirm != password) return "Passwords do not match. Try again.";

        return null;
    };


    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        console.log("Submitting...");
        const validation = validate();
        if (validation) {
            setError(validation);
            setSuccess(null);
            console.log(error);
            return;
        }

        setLoading(true);
        setError(null);
        setSuccess(null);

        try{
           const res = await fetch("/api/auth/register", {
               method: "POST",
               headers: { "Content-Type": "application/json" },
               body: JSON.stringify({username, email, password})
           });

           const data = await res.json();
           console.log(data);

           if (!res.ok){
               setError(data.error || "Something went wrong.");
           }else{
               setSuccess("Registration successful! Check your email for the activation link.")
               setUsername("");
               setEmail("");
               setPassword("");


           }
        }catch(err){
            setError("Network error: " + err);
        }

        setLoading(false);
    }


    return (
        <form onSubmit={handleSubmit}>
            {/* USERNAME */}
            <div className="flex flex-col">
                <label className="font-medium mb-1 text-black">Username</label>
                <input
                    className="w-full p-3 border rounded-lg focus:ring-2 mb-4 text-gray-700"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Your name"
                />
            </div>

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

            {/* PASSWORD */}
            <div className="flex flex-col">
                <label className="font-medium mb-1 text-black">Password</label>
                <input
                    type="password"
                    className="w-full p-3 border rounded-lg focus:ring-2 text-gray-700"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                />
            </div>

            {/* PASSWORD CONFIRMATION */}
            <div className="flex flex-col mt-5">
                <label className="font-medium mb-1 text-black">Password Confirmation</label>
                <input
                    type="password"
                    className="w-full p-3 border rounded-lg focus:ring-2 text-gray-700"
                    value={passwordConfirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                    placeholder="Password"
                />
            </div>

            {error && <p className="text-red-600 text-sm">{error}</p>}
            {success && <p className="text-green-600 text-sm">{success}</p>}


            <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 mt-3"
            >
                {loading ? "Registering..." : "Register"}
            </button>

            <div className="text-black mt-3 width flex justify-center">
                Already have an account?
                <button
                    onClick={() => window.location.href = "/login"}
                    className="text-black hover:text-blue-800 hover:underline cursor-pointer"
                >
                     Log in here.
                </button>
            </div>

        </form>

    );
}