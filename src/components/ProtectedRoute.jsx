import { Navigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

export default function ProtectedRoute({ children }) {
    const { isAuthenticated, authLoading } = useApp();

    // Tunggu Supabase selesai mengecek sesi, supaya tidak mental ke /login saat refresh
    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-[#16377D]">
                Memuat...
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
}