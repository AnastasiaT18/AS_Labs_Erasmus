"use client";

import { useEffect, useState } from "react";

type User = {
    id: number;
    name: string;
    email: string;
    role: string;
};

export default function AdminUsersTab() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);

    async function loadUsers() {
        setLoading(true);
        const res = await fetch("/api/admin/users/list");
        const data = await res.json();
        setUsers(Array.isArray(data) ? data : []);
        setLoading(false);
    }

    async function deleteUser(userId: number) {
        if (!confirm("Delete this user?")) return;
        const res = await fetch("/api/admin/users/delete", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId }),
        });

        const data = await res.json();

        if (res.ok) loadUsers();
        else alert(data.message);

    }

    useEffect(() => {
        loadUsers();
    }, []);

    if (loading) return <p>Loading users...</p>;

    return (
        <table className="w-full text-left border">
            <thead>
            <tr className="bg-gray-100">
                <th className="p-2">ID</th>
                <th className="p-2">Name</th>
                <th className="p-2">Email</th>
                <th className="p-2">Role</th>
                <th className="p-2">Actions</th>
            </tr>
            </thead>
            <tbody>
            {users.map((u) => (
                <tr key={u.id} className="border-t">
                    <td className="p-2">{u.id}</td>
                    <td className="p-2">{u.name}</td>
                    <td className="p-2">{u.email}</td>
                    <td className="p-2">{u.role}</td>
                    <td className="p-2">
                        <button
                            onClick={() => deleteUser(u.id)}
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
