import { useState, useRef, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

const card = "bg-white p-6 rounded-2xl border border-[#D0E2FF] shadow-xs";
const input =
    "w-full p-2.5 border border-gray-300 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent";
const btnBlue =
    "bg-[#3B82F6] hover:bg-[#2563EB] text-white font-bold rounded-xl text-sm transition-all cursor-pointer active:scale-95 disabled:opacity-60";

const STATUS_OPTIONS = [
    { value: "OPEN", desc: "Menerima pesanan", active: "bg-emerald-500 text-white border-emerald-500" },
    { value: "WAITLIST", desc: "Pesanan masuk daftar tunggu", active: "bg-amber-500 text-white border-amber-500" },
    { value: "CLOSED", desc: "Tidak menerima pesanan", active: "bg-rose-500 text-white border-rose-500" },
];

export default function Admin() {
    const {
        logout,
        commissionStatus,
        setCommissionStatus,
        spreadsheet,
        updateSpreadsheet,
        artworks,
        addArtwork,
        deleteArtwork,
        commissionData,
        updateCommissionCategory,
        addCommissionCategory,
        deleteCommissionCategory,
    } = useApp();

    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    // ----- Spreadsheet form -----
    const [sheetLabel, setSheetLabel] = useState("");
    const [sheetUrl, setSheetUrl] = useState("");

    useEffect(() => {
        setSheetLabel(spreadsheet.label || "");
        setSheetUrl(spreadsheet.url || "");
    }, [spreadsheet]);

    // ----- Artwork form -----
    const [newTitle, setNewTitle] = useState("");
    const [newRatio, setNewRatio] = useState("4:5");
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState("");
    const [uploading, setUploading] = useState(false);

    // ----- Price form -----
    const categories = Object.keys(commissionData);
    const [selectedCat, setSelectedCat] = useState("");
    const [editIdr, setEditIdr] = useState("");
    const [editUsd, setEditUsd] = useState("");
    const [newCat, setNewCat] = useState("");

    // Pilih kategori pertama & isi form setelah data dari database dimuat
    useEffect(() => {
        if (categories.length === 0) return;
        const cat = categories.includes(selectedCat) ? selectedCat : categories[0];
        setSelectedCat(cat);
        setEditIdr(commissionData[cat]?.idr || "");
        setEditUsd(commissionData[cat]?.usd || "");
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [commissionData, selectedCat]);

    const handleFileChange = (e) => {
        const f = e.target.files?.[0];
        if (preview) URL.revokeObjectURL(preview);
        setFile(f || null);
        setPreview(f ? URL.createObjectURL(f) : "");
    };

    const handleAddArtwork = async (e) => {
        e.preventDefault();
        if (!newTitle || !file) return alert("Harap isi judul dan pilih file gambar!");

        setUploading(true);
        const res = await addArtwork({ title: newTitle, ratio: newRatio, file });
        setUploading(false);

        if (!res.ok) return alert("Gagal mengunggah: " + res.error);

        setNewTitle("");
        setFile(null);
        setPreview("");
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleDeleteArtwork = async (id) => {
        if (!confirm("Hapus artwork ini?")) return;
        const res = await deleteArtwork(id);
        if (!res.ok) alert("Gagal menghapus: " + res.error);
    };

    const handleSetStatus = async (status) => {
        if (status === commissionStatus) return;
        const res = await setCommissionStatus(status);
        if (!res.ok) alert("Gagal mengubah status: " + res.error);
    };

    const handleSaveSpreadsheet = async (e) => {
        e.preventDefault();
        let url = sheetUrl.trim();
        // Kalau lupa menulis https://, tambahkan otomatis
        if (url && !/^https?:\/\//i.test(url)) url = "https://" + url;
        const res = await updateSpreadsheet(sheetLabel.trim(), url);
        alert(res.ok ? "Link spreadsheet berhasil disimpan!" : "Gagal: " + res.error);
    };

    const handleUpdatePrice = async (e) => {
        e.preventDefault();
        const res = await updateCommissionCategory(selectedCat, editIdr, editUsd);
        alert(res.ok ? "Harga berhasil diperbarui!" : "Gagal: " + res.error);
    };

    const handleAddCategory = async (e) => {
        e.preventDefault();
        const name = newCat.trim();
        if (!name) return;
        const res = await addCommissionCategory(name, "Rp 0", "$0");
        if (!res.ok) return alert("Gagal menambah kategori: " + res.error);
        setNewCat("");
        setSelectedCat(name);
    };

    const handleDeleteCategory = async () => {
        if (!confirm(`Hapus kategori "${selectedCat}"?`)) return;
        const res = await deleteCommissionCategory(selectedCat);
        if (!res.ok) alert("Gagal menghapus: " + res.error);
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] pt-24 pb-16 px-4 sm:px-6 lg:px-8 text-[#16377D]">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Header */}
                <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-[#D0E2FF] gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight">Admin Dashboard</h1>
                        <p className="text-sm text-gray-500 mt-1">
                            Kelola status komisi, daftar harga, dan galeri karya seni Anda.
                        </p>
                    </div>
                    <button
                        onClick={async () => {
                            await logout();
                            navigate("/");
                        }}
                        className="bg-red-500 hover:bg-red-600 active:scale-95 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-all cursor-pointer"
                    >
                        Logout
                    </button>
                </header>

                {/* 1. Status */}
                <section className={card}>
                    <h2 className="text-lg font-bold">1. Status Commission</h2>
                    <p className="text-xs text-gray-500 mt-0.5 mb-4">
                        Tersimpan di database, langsung tampil ke semua pengunjung.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {STATUS_OPTIONS.map((opt) => {
                            const isActive = commissionStatus === opt.value;
                            return (
                                <button
                                    key={opt.value}
                                    onClick={() => handleSetStatus(opt.value)}
                                    className={`text-left p-4 rounded-xl border transition-all cursor-pointer active:scale-[0.98] ${isActive
                                        ? opt.active
                                        : "bg-[#F0F6FF] border-[#D0E2FF] text-[#16377D] hover:border-[#3B82F6]"
                                        }`}
                                >
                                    <div className="font-bold text-sm">{opt.value}</div>
                                    <div className={`text-xs mt-0.5 ${isActive ? "text-white/90" : "text-gray-500"}`}>
                                        {opt.desc}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </section>

                {/* 2. Link Spreadsheet */}
                <section className={card}>
                    <h2 className="text-lg font-bold mb-1">2. Link Spreadsheet</h2>
                    <p className="text-xs text-gray-500 mb-5">
                        Tampil sebagai teks yang bisa diklik di bawah gambar utama halaman Commission. Kosongkan link untuk menyembunyikannya.
                    </p>
                    <form onSubmit={handleSaveSpreadsheet} className="grid grid-cols-1 sm:grid-cols-5 gap-4 items-end">
                        <div className="sm:col-span-2">
                            <label className="block text-xs font-bold mb-1.5 text-gray-700">Teks yang tampil</label>
                            <input
                                className={input}
                                value={sheetLabel}
                                onChange={(e) => setSheetLabel(e.target.value)}
                                placeholder="Contoh: Mrvieer Commission List"
                            />
                        </div>
                        <div className="sm:col-span-2">
                            <label className="block text-xs font-bold mb-1.5 text-gray-700">Link spreadsheet</label>
                            <input
                                className={input}
                                value={sheetUrl}
                                onChange={(e) => setSheetUrl(e.target.value)}
                                placeholder="https://docs.google.com/spreadsheets/..."
                            />
                        </div>
                        <button type="submit" className={`${btnBlue} p-2.5`}>Simpan Link</button>
                    </form>
                </section>

                {/* 3. Harga */}
                <section className={card}>
                    <h2 className="text-lg font-bold mb-1">3. Kelola Harga Commission</h2>
                    <p className="text-xs text-gray-500 mb-5">Tambah, ubah, atau hapus kategori harga.</p>

                    {categories.length > 0 && (
                        <form onSubmit={handleUpdatePrice} className="grid grid-cols-1 sm:grid-cols-5 gap-4 items-end">
                            <div>
                                <label className="block text-xs font-bold mb-1.5 text-gray-700">Kategori</label>
                                <select
                                    value={selectedCat}
                                    onChange={(e) => setSelectedCat(e.target.value)}
                                    className={input}
                                >
                                    {categories.map((c) => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold mb-1.5 text-gray-700">Harga IDR</label>
                                <input className={input} value={editIdr} onChange={(e) => setEditIdr(e.target.value)} placeholder="Rp 70k" required />
                            </div>
                            <div>
                                <label className="block text-xs font-bold mb-1.5 text-gray-700">Harga USD</label>
                                <input className={input} value={editUsd} onChange={(e) => setEditUsd(e.target.value)} placeholder="$15" required />
                            </div>
                            <button type="submit" className={`${btnBlue} p-2.5`}>Simpan Harga</button>
                            <button
                                type="button"
                                onClick={handleDeleteCategory}
                                className="bg-red-50 hover:bg-red-100 text-red-600 font-semibold p-2.5 rounded-xl text-sm border border-red-200 cursor-pointer"
                            >
                                Hapus Kategori
                            </button>
                        </form>
                    )}

                    <form onSubmit={handleAddCategory} className="mt-6 flex flex-col sm:flex-row gap-3">
                        <input
                            className={input}
                            value={newCat}
                            onChange={(e) => setNewCat(e.target.value)}
                            placeholder="Nama kategori baru, contoh: Chibi"
                        />
                        <button type="submit" className={`${btnBlue} px-5 py-2.5 whitespace-nowrap`}>
                            + Tambah Kategori
                        </button>
                    </form>
                </section>

                {/* 4. Gallery */}
                <section className={card}>
                    <h2 className="text-lg font-bold mb-1">4. Kelola Gallery Artworks</h2>
                    <p className="text-xs text-gray-500 mb-5">Gambar diunggah ke Supabase Storage.</p>

                    <form onSubmit={handleAddArtwork} className="bg-[#F8FAFC] p-5 rounded-2xl border border-gray-200 mb-8 space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                            <div>
                                <label className="block text-xs font-bold mb-1.5 text-gray-700">Judul Artwork</label>
                                <input className={input} value={newTitle} onChange={(e) => setNewTitle(e.target.value)} required />
                            </div>
                            <div>
                                <label className="block text-xs font-bold mb-1.5 text-gray-700">File Gambar</label>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="w-full p-1.5 border border-gray-300 rounded-xl text-sm bg-white cursor-pointer"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold mb-1.5 text-gray-700">Rasio</label>
                                <select className={input} value={newRatio} onChange={(e) => setNewRatio(e.target.value)}>
                                    <option value="4:5">4:5</option>
                                    <option value="16:9">16:9</option>
                                    <option value="3:4">3:4</option>
                                    <option value="1:1">1:1</option>
                                </select>
                            </div>
                        </div>

                        {preview && (
                            <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-gray-200">
                                <span className="text-xs font-bold text-gray-600">Preview:</span>
                                <img src={preview} alt="Preview" className="w-16 h-16 object-cover rounded-lg border border-gray-300" />
                            </div>
                        )}

                        <button type="submit" disabled={uploading} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl text-sm cursor-pointer disabled:opacity-60">
                            {uploading ? "Mengunggah..." : "+ Tambah Artwork"}
                        </button>
                    </form>

                    <div className="overflow-x-auto rounded-xl border border-gray-200">
                        <table className="w-full text-left text-sm border-collapse">
                            <thead>
                                <tr className="bg-[#F0F6FF] border-b border-gray-200">
                                    <th className="p-3.5 font-bold">Preview</th>
                                    <th className="p-3.5 font-bold">Judul</th>
                                    <th className="p-3.5 font-bold">Rasio</th>
                                    <th className="p-3.5 font-bold text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {artworks.length > 0 ? (
                                    artworks.map((art) => (
                                        <tr key={art.id}>
                                            <td className="p-3.5">
                                                <img src={art.image} alt={art.title} className="w-12 h-12 object-cover rounded-lg border border-gray-200" />
                                            </td>
                                            <td className="p-3.5 font-semibold text-gray-800">{art.title || "Untitled"}</td>
                                            <td className="p-3.5">
                                                <span className="bg-gray-100 px-2.5 py-1 rounded-md text-xs font-medium">{art.ratio}</span>
                                            </td>
                                            <td className="p-3.5 text-right">
                                                <button
                                                    onClick={() => handleDeleteArtwork(art.id)}
                                                    className="bg-red-50 hover:bg-red-100 text-red-600 font-semibold px-3 py-1.5 rounded-lg text-xs border border-red-200 cursor-pointer"
                                                >
                                                    Hapus
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="text-center p-6 text-gray-400 text-sm">
                                            Belum ada artwork.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
        </div>
    );
}