import { getAuthenticatedUser } from "@/app/lib/auth";
import PostsFeed from "@/app/feed/PostsFeed";
import CreatePost from "@/app/feed/CreatePost";
import LogoutButton from "@/app/logout/LogoutButton";

export default async function FeedPage() {
    const user = await getAuthenticatedUser();

    return (
        <div className="min-h-screen bg-gray-50">

            <main className="max-w-3xl mx-auto p-6 md:p-4 bg-gray-50 min-h-screen">
                {/* HEADER */}
                <header className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 md:mb-0">
                        Microblog
                    </h1>
                    {user && <LogoutButton />}
                </header>

                {/* AUTH STATUS */}
                {!user ? (
                    <div className="text-center py-10">
                        <p className="mb-4 text-gray-600">You are not logged in.</p>
                        <a
                            href="/login"
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                        >
                            Login
                        </a>
                    </div>
                ) : (
                    <div className="mb-8">
                        <p className="text-gray-700 mb-4">
                            Logged in as <strong>{user.email}</strong> ({user.role})
                        </p>

                        {/* CREATE POST CARD */}
                        <div className="bg-white p-4 rounded-lg shadow mb-6">
                            <CreatePost/>
                        </div>
                    </div>
                )}

                {/* POSTS FEED */}
                <section className="space-y-6">
                    <PostsFeed user={user}/>
                </section>
            </main>
        </div>
            );
            }
