import ResetPassForm from "./ResetPassForm";

export default function Page() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="bg-white shadow-xl rounded-xl p-10 w-full max-w-md">
                <h1 className="text-3xl font-bold text-black mb-6 text-center">Reset Password</h1>
                <ResetPassForm />
            </div>
        </div>
    );
}
