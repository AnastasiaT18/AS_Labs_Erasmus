"use client";

import { useState } from "react";
import AdminUsersTab from "@/app/components/AdminUsersTab";
import AdminPostsTab from "@/app/components/AdminPostsTab";
import AdminCommentsTab from "@/app/components/AdminCommentsTab";
import LogoutButton from "@/app/logout/LogoutButton";

export default function AdminPanel() {
    const [activeTab, setActiveTab] = useState<"users" | "posts" | "comments">("users");

    return (
        <div className="min-h-screen bg-gray-50 p-6 text-gray-800">
            <h1 className="text-3xl font-bold mb-6 ">Admin Panel</h1>

            {/* Tab navigation */}
            <nav className="flex  gap-4 mb-6">
                <button
                    className={`px-5 py-2 rounded-md transition-all ${
                        activeTab === "users"
                            ? "bg-blue-600 text-white shadow-md"
                            : "bg-white text-gray-700 hover:bg-gray-100"
                    }`}
                    onClick={() => setActiveTab("users")}
                >
                    Users
                </button>
                <button
                    className={`px-5 py-2 rounded-md transition-all ${
                        activeTab === "posts"
                            ? "bg-blue-600 text-white shadow-md"
                            : "bg-white text-gray-700 hover:bg-gray-100"
                    }`}
                    onClick={() => setActiveTab("posts")}
                >
                    Posts
                </button>
                <button
                    className={`px-5 py-2 rounded-md transition-all ${
                        activeTab === "comments"
                            ? "bg-blue-600 text-white shadow-md"
                            : "bg-white text-gray-700 hover:bg-gray-100"
                    }`}
                    onClick={() => setActiveTab("comments")}
                >
                    Comments
                </button>

               <LogoutButton />
            </nav>

            {/* Tab content */}
            <div className="bg-white rounded-lg shadow p-6">
                {activeTab === "users" && <AdminUsersTab />}
                {activeTab === "posts" && <AdminPostsTab />}
                {activeTab === "comments" && <AdminCommentsTab />}
            </div>
        </div>
    );
}
