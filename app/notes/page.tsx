"use client"

import { LuPencil, LuTrash2, LuLogOut } from "react-icons/lu";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Note {
    id: number;
    title: string;
    content: string;
    createdAt: string;
}

export default function NotesPage() {
    const [username, setUsername] = useState("");
    const [notes, setNotes] = useState<Note[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentNote, setCurrentNote] = useState<Note | null>(null);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        const storedUsername = localStorage.getItem("username");

        if (!storedToken) {
            router.push("/login");
            return;
        }

        if (storedUsername) {
            setUsername(storedUsername);
        }

        fetchNotes();
    }, []);

    const fetchNotes = async () => {
        const storedToken = localStorage.getItem("token");
        try {
            const res = await fetch("http://localhost:3000/api/notes", {
                headers: { Authorization: `Bearer ${storedToken}` },
            });

            const data = await res.json();
            if (res.ok) setNotes(data);
            else console.error("Failed to fetch notes");
        } catch (err) {
            console.error("Error fetching notes", err);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        const storedToken = localStorage.getItem("token");
        if (!storedToken) {
            setError("Unauthorized. Please login.");
            return;
        }

        try {
            // Make sure currentNote?.id is defined when editing
            if (isEditing && !currentNote?.id) {
                setError("Note ID is missing.");
                return;
            }

            const url = isEditing
                ? `http://localhost:3000/api/notes/${currentNote?.id}`
                : "http://localhost:3000/api/notes";
            const method = isEditing ? "PUT" : "POST";

            console.log("Submitting to:", url, "with method:", method);
            console.log("Data:", { title, content });

            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${storedToken}`,
                },
                body: JSON.stringify({ title, content }),
            });

            // Log the raw response for debugging
            console.log("Response status:", res.status);
            const data = await res.json();
            console.log("Response data:", data);

            if (!res.ok) {
                setError(data.error || "Failed to save note.");
                return;
            }

            await fetchNotes(); // Refresh the list - make sure to await this
            setIsOpen(false);
            setIsEditing(false);
            setTitle("");
            setContent("");
            setCurrentNote(null);
        } catch (err) {
            console.error("Error in handleSubmit:", err);
            setError("Something went wrong. Please try again.");
        }
    };

    const handleDelete = async (id: number) => {
        const storedToken = localStorage.getItem("token");
        if (!storedToken) {
            setError("Unauthorized. Please login.");
            return;
        }

        try {
            const res = await fetch(`http://localhost:3000/api/notes/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${storedToken}` },
            });

            if (res.ok) {
                setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
            } else {
                const errorData = await res.json();
                console.error("Failed to delete note:", errorData);
                setError(errorData.error || "Failed to delete note");
            }
        } catch (err) {
            console.error("Error deleting note", err);
            setError("Something went wrong. Please try again.");
        }
    };

    const handleEdit = (note: Note) => {
        setIsEditing(true);
        setIsOpen(true);
        setCurrentNote(note);
        setTitle(note.title);
        setContent(note.content);
    };

    const signOut = () => {
        localStorage.removeItem("token")
        localStorage.removeItem("username");
        router.push("/login")
    };

    return (
        <div className="min-h-screen animated-gradient">
            <div className="p-6">
                <h1 className="text-4xl font-bold text-center mb-6 text-white font-sans">
                    Welcome to your notes, {username}!
                </h1>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 p-4">
                    {notes.map((note) => (

                        <div
                            key={note.id}
                            className="relative bg-black/30 backdrop-blur-md border border-red-900/30 p-6 rounded-xl shadow-md hover:shadow-lg text-white transition-transform duration-200 hover:scale-105 hover:bg-black/10 group"
                        >
                            <h2 className="text-lg font-semibold mb-2 break-words">{note.title}</h2>
                            <p className="text-gray-300 mb-4 break-words">{note.content}</p>
                            <p className="text-sm text-gray-400">{new Date(note.createdAt).toLocaleDateString()}</p>

                            {/* Edit & Delete Buttons */}
                            <div className="absolute bottom-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                <button
                                    className="bg-blue-700 hover:bg-blue-800 text-white p-2 rounded-full shadow-lg"
                                    onClick={() => handleEdit(note)}
                                >
                                    <LuPencil className="w-4 h-4" />
                                </button>
                                <button
                                    className="bg-red-700 hover:bg-red-900 text-white p-2 rounded-full shadow-lg"
                                    onClick={() => handleDelete(note.id)}
                                >
                                    <LuTrash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                    ))}
                </div>
            </div>

            <div>
                <button
                    className="fixed bottom-6 right-6 bg-black/50 backdrop-blur-md text-white rounded-full w-14 h-14
                              flex items-center justify-center text-2xl transition-all
                              transform hover:rotate-360 ease-in-out duration-500 hover:bg-black/20"

                    onClick={() => {
                        setIsOpen(true);
                        setIsEditing(false);
                        setTitle("");
                        setContent("");
                        setCurrentNote(null);
                    }}
                >
                    +
                </button>

                {isOpen && (
                    <div className="fixed inset-0 bg-black/20 backdrop-blur-md flex justify-center items-center">
                        <div className="bg-black/50 p-6 rounded-lg shadow-lg w-1/2 h-1/2 backdrop-blur-md">
                            <h2 className="text-xl text-gray-400 font-bold mb-4">
                                {isEditing ? "Edit Note" : "Add Note"}
                            </h2>
                            {error && <p className="text-red-500">{error}</p>}
                            <form onSubmit={handleSubmit}>
                                <input
                                    type="text"
                                    placeholder="Title"
                                    className="w-full p-3 bg-black/50 text-white rounded mb-2"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                />
                                <textarea
                                    placeholder="Content"
                                    className="w-full p-3 bg-black/50 text-white rounded mb-2 h-80 resize-none"
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    required
                                />
                                <div className="flex justify-end space-x-2">
                                    <button
                                        type="button"
                                        className="p-2 bg-red-800 hover:bg-red-950 text-gray-200 rounded"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="p-2 w-18 bg-slate-700 text-gray-200 hover:bg-slate-900 rounded"
                                    >
                                        {isEditing ? "Update" : "Add"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

            </div>
            <button
                onClick={signOut}
                className="fixed top-6 right-6 bg-black/50 text-gray-300 rounded-2xl w-14 h-14 flex items-center justify-center text-2xl transition-all transform ease-in-out duration-500 hover:bg-red-700/30 backdrop-blur-md shadow-md hover:shadow-2xl"
            >
                <LuLogOut className="w-6 h-6" />
            </button>
        </div>
    );
}

