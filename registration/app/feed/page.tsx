import { getAuthenticatedUser } from "@/app/lib/auth";
import PostsFeed from "@/app/feed/PostsFeed";
import CreatePost from "@/app/feed/CreatePost";
import LogoutButton from "@/app/logout/LogoutButton";
import { redirect } from "next/navigation";

export default async function FeedPage() {
    const user = await getAuthenticatedUser();

    if (!user) {
        console.log("not any user");
    } else if (user.role === "admin") {
        redirect("/admin");
    } else {
        console.log("Server FeedPage user:", user.role);
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <main className="w-full max-w-5xl mx-auto p-4 md:p-6 space-y-6">

                {/* HEADER */}
                <header className="flex flex-col w-full md:flex-row items-center justify-between bg-white p-4 rounded-lg  ">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Microblog</h1>

                    <div className="hidden md:flex flex-1 justify-center">
                        {/* Future nav / search */}
                    </div>

                    <div className="flex items-center space-x-3 ">
                        {user ? (
                            <>
                                <span className="text-gray-700 font-medium">Hi, {user.name}!</span>
                                <LogoutButton />
                            </>
                        ) : (
                            <a
                                href="/login"
                                className="px-3 py-1 text-sm bg-gray-200 text-gray-800 font-medium rounded hover:bg-gray-300 transition"
                            >
                                Login
                            </a>
                        )}
                    </div>
                </header>

                {/* AUTH STATUS / CREATE POST */}
                {user ? (
                    <div className="bg-white rounded-lg md:w-2/3 mx-auto text-center">
                        {/* CREATE POST CARD */}
                            <CreatePost />
                    </div>
                ) : (
                    <div className="bg-white p-6 rounded-lg md:w-2/3 mx-auto text-center">
                        <p className="mb-4 text-gray-600">You cannot make any posts unless you're logged in.</p>
                        <a
                            href="/login"
                            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
                        >
                            Login
                        </a>
                    </div>
                )}

                {/* POSTS FEED */}
                <section className=" w-full md:w-2/3 mx-auto space-y-6">
                    <PostsFeed user={user} />
                </section>

            </main>
        </div>
    );
}
