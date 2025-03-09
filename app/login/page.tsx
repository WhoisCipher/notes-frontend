"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            const res = await fetch("http://localhost:3000/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
                credentials: "include",
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Invalid credentials");
                return;
            }

            localStorage.setItem("token", data.token);
            localStorage.setItem("email", data.email);
            localStorage.setItem("username", data.username);

            router.push("/notes");
        } catch (err) {
            setError("Something went wrong. Please try again.");
        }
    };

    return (
        <div className="flex justify-center items-center h-screen">
            <form onSubmit={handleSubmit} className="bg-black p-6 rounded shadow-lg w-96 dark:bg-black">
                <h2 className="text-xl text-white font-bold mb-4">Login</h2>
                {error && <p className="text-red-500">{error}</p>}
                <input
                    type="email"
                    placeholder="Email"
                    className="w-full p-2 border text-gray-500 dark:text-gray-500 rounded mb-2"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    className="w-full p-2 border text-gray-500 dark:text-gray-500 rounded mb-2"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit" className="w-full p-1 bg-gray-600 hover:bg-gray-800 text-black text-lg rounded dark:bg-gray-600 dark:hover:bg-gray-800">
                    Login
                </button>
            </form>
        </div>
    );
}

