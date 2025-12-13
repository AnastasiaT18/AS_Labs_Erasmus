import LoginForm from "./LoginForm";

export default function Page() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="bg-white shadow-xl rounded-xl p-10 w-full max-w-md">
                <h1 className="text-3xl font-bold text-black mb-6 text-center">Log In</h1>
                <LoginForm />
            </div>
        </div>
    );
}
