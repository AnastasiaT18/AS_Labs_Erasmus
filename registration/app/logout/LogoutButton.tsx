"use client";


import {useState} from "react";
import { useRouter } from "next/navigation"; // ✅ correct import

export default function LogoutButton() {

    const [loading, setLoading] = useState(false);
    const router = useRouter(); // ✅ call the hook



    const handleLogout = async ()=>{
        setLoading(true);
        try{
            const res = await fetch("/api/auth/logout", {
                method: "POST",
            });

            if(res.ok){
                router.push("/feed"); // redirect to login
            }
            else {
                console.error("Logout failed");
            }
        }catch(err){
            console.error(err);
        }finally {
            setLoading(false);
        }
    }

    return(

        <button
            onClick={handleLogout}
            disabled={loading}
            className="text-white bg-red-600 py-2 px-4 rounded hover:bg-red-700 mt-4"
        >
            {loading ? "Logging out...": "Logout"}

        </button>

    );
}