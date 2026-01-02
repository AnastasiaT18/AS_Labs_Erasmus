"use client";

import { useState } from "react";

export default function SearchBar({onSearch,}: {
    onSearch: (q: string) => void;
}) {
    const [q, setQ] = useState("");

    return (
        <div className="flex gap-2 mb-6">
            <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search posts..."
                className="w-full p-3 border-1 border-gray-300 rounded-lg text-black focus:bg-white"

            />
            <button
                onClick={() => onSearch(q)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none"
            >
                Search
            </button>
        </div>
    );
}
