import Link from "next/link";

export default function HomePage() {
    return (
        <div className="min-h-screen flex justify-center items-center flex-col text-white bg-stone-700">
            {/* Hero Section with Glassmorphism */}
            <h1 className="text-6xl text-slate-200 font-bold mb-8 text-center">notes</h1>

            {/* Buttons Section */}
            <div className="flex gap-6 justify-center">
                <Link href="/login">
                    <button className="bg-black/50 backdrop-blur-md text-slate-200 w-26 h-14 rounded-xl text-lg hover:bg-gradient-to-l from-rose-900/80 to-red-900/80 shadow-lg hover:shadow-2xl transition-all duration-500 ease-in-out">
                        Login
                    </button>
                </Link>
                <Link href="/signup">
                    <button className="bg-black/50 backdrop-blur-md text-slate-200 w-26 h-14 rounded-xl text-lg hover:bg-gradient-to-l from-slate-950/80 to-blue-950/60 shadow-lg hover:shadow-2xl transition-all duration-500 ease-in-out">
                        Sign Up
                    </button>
                </Link>
            </div>
        </div>
    );
}

