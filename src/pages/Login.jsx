import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { login, isAuthenticated } = useApp();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) navigate("/admin");
    }, [isAuthenticated, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        const result = await login(email, password);
        if (!result.ok) setError("Email atau password salah!");
        setLoading(false);
    };

    return (
        <div className="min-h-screen pt-28 pb-10 flex items-center justify-center px-4 bg-[#F2F9FD]">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-md border border-[#D0E2FF] w-full max-w-md">
                <h1 className="text-2xl font-bold text-[#16377D] mb-6 text-center">Admin Login</h1>
                {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

                <div className="mb-4">
                    <label className="block text-sm font-semibold text-[#16377D] mb-2">Email</label>
                    <input
                        type="email"
                        className="w-full px-4 py-2 border border-[#D0E2FF] rounded-lg focus:outline-none focus:border-[#3B82F6]"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-semibold text-[#16377D] mb-2">Password</label>
                    <input
                        type="password"
                        className="w-full px-4 py-2 border border-[#D0E2FF] rounded-lg focus:outline-none focus:border-[#3B82F6]"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#3B82F6] text-white font-bold py-2.5 rounded-lg hover:bg-[#2563EB] transition-colors disabled:opacity-60"
                >
                    {loading ? "Masuk..." : "Login"}
                </button>
            </form>
        </div>
    );
}