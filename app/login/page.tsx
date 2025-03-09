"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link"; // Add Link for navigation

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
        <div className="min-h-screen flex justify-center items-center flex-col text-white bg-rose-900">
            <form
                onSubmit={handleSubmit}
                className="bg-black/20 backdrop-blur-md p-8 rounded-lg shadow-xl w-96"
            >
                <h2 className="text-2xl text-cyan-500 font-bold mb-6 text-center">Login</h2>
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}

                <input
                    type="email"
                    placeholder="Email"
                    className="w-full p-3 border border-transparent bg-black/50 text-white rounded mb-4 placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    className="w-full p-3 border border-transparent bg-black/50 text-white rounded mb-4 placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button
                    type="submit"
                    className="w-full p-3 bg-cyan-600 hover:bg-cyan-800 text-white text-lg rounded-lg transition-colors duration-200 ease-in-out"
                >
                    Login
                </button>

                {/* Add Signup Link */}
                <div className="mt-4 text-center">
                    <p className="text-sm text-gray-300">
                        Don't have an account?{" "}
                        <Link href="/signup" className="text-cyan-500 hover:underline">
                            Sign up
                        </Link>
                    </p>
                </div>
            </form>
        </div>
    );
}

