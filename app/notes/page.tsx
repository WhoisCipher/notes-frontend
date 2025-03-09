"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function NotesPage() {
    const [loading, setLoading] = useState(true);
    const [username, setUsername] = useState("");
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");

        const storedUsername = localStorage.getItem("username");
        if (storedUsername) {
            setUsername(storedUsername);
        }

        if (!token) {
            router.push("/login");
        } else {
            setLoading(false);
        }
    }, [router]);

    if (loading) return <p>Loading...</p>;

    return (
        <div className="flex justify-center items-center h-screen">
            <h1 className="text-2xl font-bold">Welcome to the Notes Page {username}!</h1>
        </div>
    );
}

