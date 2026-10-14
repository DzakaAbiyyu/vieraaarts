import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

export const AppContext = createContext();

const BUCKET = "gallery";

export function AppProvider({ children }) {
    const [artworks, setArtworks] = useState([]);
    const [commissionStatus, setCommissionStatusState] = useState("OPEN");
    const [commissionData, setCommissionData] = useState({});
    const [session, setSession] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);

    const isAuthenticated = !!session;

    // ---------- AUTH (Supabase Auth) ----------
    useEffect(() => {
        supabase.auth.getSession().then(({ data }) => {
            setSession(data.session);
            setAuthLoading(false);
        });
        const { data: listener } = supabase.auth.onAuthStateChange((_event, s) => {
            setSession(s);
        });
        return () => listener.subscription.unsubscribe();
    }, []);

    const login = async (email, password) => {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        return error ? { ok: false, error: error.message } : { ok: true };
    };

    const logout = async () => {
        await supabase.auth.signOut();
    };

    // ---------- FETCH DATA ----------
    const fetchArtworks = async () => {
        const { data, error } = await supabase
            .from("artworks")
            .select("*")
            .order("id", { ascending: false });
        if (error) console.error("Gagal mengambil artworks:", error.message);
        else setArtworks(data || []);
    };

    const fetchStatus = async () => {
        const { data, error } = await supabase
            .from("commission_settings")
            .select("status")
            .eq("id", 1)
            .single();
        if (error) console.error("Gagal mengambil status:", error.message);
        else setCommissionStatusState(data.status);
    };

    const fetchPrices = async () => {
        const { data, error } = await supabase
            .from("commission_prices")
            .select("*")
            .order("sort_order", { ascending: true });
        if (error) {
            console.error("Gagal mengambil harga:", error.message);
            return;
        }
        const obj = {};
        (data || []).forEach((row) => {
            obj[row.category] = { idr: row.idr, usd: row.usd, artworks: row.artworks || [] };
        });
        setCommissionData(obj);
    };

    useEffect(() => {
        fetchArtworks();
        fetchStatus();
        fetchPrices();
    }, []);

    // ---------- ARTWORKS ----------
    // Dipanggil dengan { title, ratio, file } -> file adalah objek File asli
    const addArtwork = async ({ title, ratio, file }) => {
        try {
            const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
            const path = `${Date.now()}_${safeName}`;

            const { error: uploadError } = await supabase.storage
                .from(BUCKET)
                .upload(path, file);
            if (uploadError) throw uploadError;

            const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(path);

            const { data, error: dbError } = await supabase
                .from("artworks")
                .insert([{ title, ratio, image: urlData.publicUrl, image_path: path }])
                .select()
                .single();

            if (dbError) {
                // rollback file agar tidak jadi sampah di storage
                await supabase.storage.from(BUCKET).remove([path]);
                throw dbError;
            }

            setArtworks((prev) => [data, ...prev]);
            return { ok: true };
        } catch (error) {
            return { ok: false, error: error.message };
        }
    };

    const deleteArtwork = async (id) => {
        const art = artworks.find((a) => a.id === id);
        const { error } = await supabase.from("artworks").delete().eq("id", id);
        if (error) return { ok: false, error: error.message };

        if (art?.image_path) {
            await supabase.storage.from(BUCKET).remove([art.image_path]);
        }
        setArtworks((prev) => prev.filter((a) => a.id !== id));
        return { ok: true };
    };

    // ---------- STATUS COMMISSION ----------
    const setCommissionStatus = async (status) => {
        const previous = commissionStatus;
        setCommissionStatusState(status); // optimistic
        const { error } = await supabase
            .from("commission_settings")
            .update({ status })
            .eq("id", 1);
        if (error) {
            setCommissionStatusState(previous);
            return { ok: false, error: error.message };
        }
        return { ok: true };
    };

    // ---------- HARGA (CRUD) ----------
    const updateCommissionCategory = async (category, idr, usd) => {
        const { error } = await supabase
            .from("commission_prices")
            .update({ idr, usd })
            .eq("category", category);
        if (error) return { ok: false, error: error.message };
        setCommissionData((prev) => ({
            ...prev,
            [category]: { ...prev[category], idr, usd },
        }));
        return { ok: true };
    };

    const addCommissionCategory = async (category, idr, usd) => {
        const sort_order = Object.keys(commissionData).length + 1;
        const { error } = await supabase
            .from("commission_prices")
            .insert([{ category, idr, usd, sort_order }]);
        if (error) return { ok: false, error: error.message };
        setCommissionData((prev) => ({
            ...prev,
            [category]: { idr, usd, artworks: [] },
        }));
        return { ok: true };
    };

    const deleteCommissionCategory = async (category) => {
        const { error } = await supabase
            .from("commission_prices")
            .delete()
            .eq("category", category);
        if (error) return { ok: false, error: error.message };
        setCommissionData((prev) => {
            const next = { ...prev };
            delete next[category];
            return next;
        });
        return { ok: true };
    };

    return (
        <AppContext.Provider
            value={{
                artworks,
                addArtwork,
                deleteArtwork,
                commissionStatus,
                setCommissionStatus,
                commissionData,
                updateCommissionCategory,
                addCommissionCategory,
                deleteCommissionCategory,
                isAuthenticated,
                authLoading,
                login,
                logout,
            }}
        >
            {children}
        </AppContext.Provider>
    );
}

export const useApp = () => useContext(AppContext);