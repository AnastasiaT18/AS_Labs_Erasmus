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
                className="flex-1 p-2 border rounded"
            />
            <button
                onClick={() => onSearch(q)}
                className="px-4 py-2 bg-blue-600 text-white rounded"
            >
                Search
            </button>
        </div>
    );
}
