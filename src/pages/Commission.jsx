import { useState, useContext, useEffect } from "react";
// Pastikan path import AppContext sesuai dengan struktur foldermu
import { AppContext } from "../context/AppContext";

// 1. Jadikan data hardcoded sebagai FALLBACK (cadangan)
const defaultCommissionData = {
    "Bust Up": {
        idr: "Rp 70k",
        usd: "$15",
        artworks: ["/artworks/4_5-artwork-7.png", "/artworks/4_5-artwork-9.png"],
    },
    "Half Body": {
        idr: "Rp 90k",
        usd: "$20",
        artworks: ["/artworks/4_5-artwork-1.png"],
    },
    "Knee Up": {
        idr: "Rp 120k",
        usd: "$25",
        artworks: ["/artworks/4_5-artwork-2.png", "/artworks/4_5-artwork-3.png"],
    },
    "Full body": {
        idr: "Rp 150k",
        usd: "$35",
        artworks: ["/artworks/4_5-artwork-5.png", "/artworks/4_5-artwork-6.png"],
    },
};

export default function Commission() {
    // 2. Ambil data dari Context dengan nama variabel yang sesuai (commissionData & commissionStatus)
    const context = useContext(AppContext) || {};
    const { commissionData: adminPrices, commissionStatus, spreadsheet } = context;

    // Status: OPEN / WAITLIST / CLOSED
    const status = commissionStatus || "OPEN";
    const isClosed = status === "CLOSED";
    const isWaitlist = status === "WAITLIST";

    // 3. Gunakan data dari Admin jika ada, jika tidak gunakan defaultCommissionData
    const commissionData = (adminPrices && Object.keys(adminPrices).length > 0)
        ? adminPrices
        : defaultCommissionData;

    const categories = Object.keys(commissionData);

    const [activeTab, setActiveTab] = useState(categories[0]);
    const [selectedImgIndex, setSelectedImgIndex] = useState(0);

    // 4. Efek pengaman: Menggunakan categoriesKey agar dependency array stabil
    const categoriesKey = categories.join("|");
    useEffect(() => {
        if (!categories.includes(activeTab)) {
            setActiveTab(categories[0]);
            setSelectedImgIndex(0);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [categoriesKey, activeTab]);

    // 5. Perlindungan data bersarang (Nested Data Protection)
    const currentCategory = commissionData[activeTab] || commissionData[categories[0]] || {};
    const artworksList = Array.isArray(currentCategory.artworks) ? currentCategory.artworks : [];
    const activeImage = artworksList[selectedImgIndex] || artworksList[0] || "";

    // Format pesan & link WhatsApp dinamis
    const priceInfo = `(${currentCategory.idr || "-"} / ${currentCategory.usd || "-"})`;
    const waMessage = encodeURIComponent(
        isWaitlist
            ? `Halo! Saya ingin masuk waitlist dengan kategori *${activeTab}* ${priceInfo}.`
            : `Halo! Saya ingin pesan commission kategori *${activeTab}* ${priceInfo}.`
    );
    const waLink = `https://wa.me/6285111342521?text=${waMessage}`;

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setSelectedImgIndex(0);
    };

    return (
        <div className="w-full min-h-screen bg-[#F4F8FA] flex flex-col items-center py-10 px-4 sm:px-6 font-sans pt-24">

            {/* Header Title */}
            <div className="text-center max-w-2xl mb-12 sm:mb-16">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#16377D] mb-4">
                    Commission Rates & Terms
                </h1>
                <p className="text-base sm:text-lg md:text-xl text-[#16377D] leading-relaxed">
                    Welcome, and <span className="font-bold">thank you</span> for stopping by my little corner! Here's everything you <span className="font-bold">need to know</span> before we make something cute together
                </p>
            </div>

            {/* Rules Section */}
            <div className="w-full max-w-5xl flex flex-col items-center mb-16 sm:mb-20">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-[#16377D] mb-6 sm:mb-8 text-center">
                    Let's <span className="font-bold text-[#16377D]">read</span> before commissioning!
                </h2>

                <div className="w-full space-y-6">
                    {/* I Can / Cannot Draw */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Can Draw */}
                        <div className="bg-[#EBF3FC] border border-[#D0E2FF] rounded-2xl p-5 sm:p-6">
                            <h3 className="text-lg sm:text-xl font-bold text-[#16377D] mb-4">
                                I <span className="text-[#16377D]">can</span> draw
                            </h3>
                            <ul className="space-y-2.5 text-[#16377D] font-medium text-sm sm:text-base">
                                <li className="flex items-center gap-2.5">
                                    <img src="/webdesign/check-circle.png" alt="check" className="w-5 h-5 object-contain shrink-0" />
                                    <span>SFW / NSFW</span>
                                </li>
                                <li className="flex items-center gap-2.5">
                                    <img src="/webdesign/check-circle.png" alt="check" className="w-5 h-5 object-contain shrink-0" />
                                    <span>LGBT / straight ships</span>
                                </li>
                                <li className="flex items-center gap-2.5">
                                    <img src="/webdesign/check-circle.png" alt="check" className="w-5 h-5 object-contain shrink-0" />
                                    <span>Male / female characters</span>
                                </li>
                                <li className="flex items-center gap-2.5">
                                    <img src="/webdesign/check-circle.png" alt="check" className="w-5 h-5 object-contain shrink-0" />
                                    <span>Nekomimi / slight mecha</span>
                                </li>
                                <li className="flex items-center gap-2.5">
                                    <img src="/webdesign/x-circle.png" alt="cannot" className="w-5 h-5 object-contain shrink-0" />
                                    <span>Furry</span>
                                </li>
                            </ul>
                        </div>

                        {/* Cannot Draw */}
                        <div className="bg-[#EBF3FC] border border-[#D0E2FF] rounded-2xl p-5 sm:p-6">
                            <h3 className="text-lg sm:text-xl font-bold text-[#16377D] mb-4">
                                I <span className="text-[#16377D]">cannot</span> draw
                            </h3>
                            <ul className="space-y-2.5 text-[#16377D] font-medium text-sm sm:text-base">

                                <li className="flex items-center gap-2.5">
                                    <img src="/webdesign/x-circle.png" alt="cannot" className="w-5 h-5 object-contain shrink-0" />
                                    <span>Heavy armor</span>
                                </li>
                                <li className="flex items-center gap-2.5">
                                    <img src="/webdesign/x-circle.png" alt="cannot" className="w-5 h-5 object-contain shrink-0" />
                                    <span>Elderly / baby characters</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Turnaround Time */}
                    <div className="bg-[#EBF3FC] border border-[#D0E2FF] rounded-2xl p-5 sm:p-6">
                        <h3 className="text-lg sm:text-xl font-bold text-[#16377D] mb-2">Turnaround time</h3>
                        <p className="text-[#16377D] leading-relaxed font-medium text-sm sm:text-base">
                            1–7 days per piece, not counting queue time. I work about 4–5 hours a day, so thank you for your patience.
                        </p>
                    </div>

                    {/* Terms of Service */}
                    <div className="bg-[#EBF3FC] border border-[#D0E2FF] rounded-2xl p-5 sm:p-6">
                        <h3 className="text-lg sm:text-xl font-bold text-[#16377D] mb-3">Terms of service</h3>
                        <ul className="list-disc list-inside space-y-1.5 text-[#16377D] font-medium text-sm sm:text-base">
                            <li>Payment is made after the lineart stage.</li>
                            <li>No refunds once payment is sent.</li>
                            <li>Finished pieces may be posted as samples — let me know if you'd like yours kept private.</li>
                            <li>Final high-res file is delivered by Gmail, not Drive.</li>
                        </ul>
                    </div>

                    {/* Extra Charges */}
                    <div className="bg-[#EBF3FC] border border-[#D0E2FF] rounded-2xl p-5 sm:p-6">
                        <h3 className="text-lg sm:text-xl font-bold text-[#16377D] mb-4">Extra charges</h3>
                        <div className="space-y-2.5 text-[#16377D] font-medium text-sm sm:text-base">
                            <div className="flex justify-between items-center gap-2">
                                <span>• Detailed character</span>
                                <span className="font-semibold text-right">+5% per detail</span>
                            </div>
                            <div className="flex justify-between items-center gap-2">
                                <span>• Detailed background</span>
                                <span className="font-semibold text-right">+20% – 50%</span>
                            </div>
                            <div className="flex justify-between items-center gap-2">
                                <span>• Commercial use</span>
                                <span className="font-semibold text-right">2x base price</span>
                            </div>
                            <div className="flex justify-between items-center gap-2">
                                <span>• Extra revision</span>
                                <span className="font-semibold text-right">+10% each</span>
                            </div>
                            <div className="flex justify-between items-center gap-2">
                                <span>• Extra character</span>
                                <span className="font-semibold text-right">(base price + 20%) + base price</span>
                            </div>
                            <div className="flex justify-between items-center gap-2">
                                <span>• Difficult pose</span>
                                <span className="font-semibold text-right">+10%</span>
                            </div>
                            <div className="flex justify-between items-center gap-2">
                                <span>• Rush commission</span>
                                <span className="font-semibold text-right">+20% per day skipped</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Interactive Showcase Section */}
            <div className="w-full max-w-5xl flex flex-col items-center mb-16 sm:mb-24">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-[#16377D] mb-8 sm:mb-10 text-center">
                    All set for a <span className="font-bold text-[#16377D]">commission</span>?
                </h2>

                <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                    {/* Main Image Preview + Link Spreadsheet */}
                    <div className="lg:col-span-6">
                        <div className="aspect-[5/4] bg-gray-200 rounded-2xl overflow-hidden shadow-sm border border-gray-200 flex items-center justify-center">
                            {activeImage ? (
                                <img
                                    src={activeImage}
                                    alt={activeTab}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.currentTarget.src = "https://via.placeholder.com/400x500?text=Artwork+Preview";
                                    }}
                                />
                            ) : (
                                <span className="text-gray-500 font-medium">No Image Available</span>
                            )}
                        </div>
                    </div>

                    {/* Thumbnails Sidebar */}
                    <div className="lg:col-span-2 flex lg:flex-col gap-3 overflow-x-auto pb-2 lg:pb-0">
                        {artworksList.map((artSrc, idx) => (
                            <button
                                key={idx}
                                onClick={() => setSelectedImgIndex(idx)}
                                className={`w-20 lg:w-full aspect-[5/4] bg-gray-300 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${selectedImgIndex === idx
                                    ? "border-[#1D4ED8]"
                                    : "border-transparent opacity-80"
                                    }`}
                            >
                                <img
                                    src={artSrc}
                                    alt={`thumbnail-${idx}`}
                                    className="w-full h-full object-cover"
                                />
                            </button>
                        ))}
                    </div>

                    {/* Detail & Tabs Box */}
                    <div className="lg:col-span-4 bg-white border border-[#D0E2FF] rounded-2xl p-5 sm:p-6 flex flex-col justify-between h-full min-h-[380px] sm:min-h-[420px]">
                        <div>
                            {/* Tabs Navbar */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 bg-[#F0F6FF] p-1.5 rounded-xl mb-6 text-xs font-semibold gap-1.5">
                                {categories.map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => handleTabChange(tab)}
                                        className={`py-2 px-2 rounded-lg transition-all cursor-pointer text-center ${activeTab === tab
                                            ? "bg-[#3B82F6] text-white shadow-sm"
                                            : "text-[#16377D] hover:text-gray-900"
                                            }`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>

                            {/* Pricing Info */}
                            <div className="mb-6">
                                <div className="text-2xl font-extrabold text-[#16377D]">
                                    {currentCategory.idr || "-"}
                                </div>
                                <div className="text-lg font-bold text-[#16377D]">
                                    {currentCategory.usd || "-"}
                                </div>
                            </div>

                            {/* Payment Info */}
                            <div className="text-sm text-[#16377D] font-medium space-y-1 mb-8">
                                <div>Payment :</div>
                                <div className="pl-3">- Paypal</div>
                                <div className="pl-3">- Gopay</div>
                                <div className="pl-3">- BCA</div>
                            </div>
                        </div>

                        {/* WhatsApp CTA */}
                        {!isClosed ? (
                            <a
                                href={waLink}
                                target="_blank"
                                rel="noreferrer"
                                className="w-full bg-[#3B82F6] hover:bg-[#60A5FA] text-white font-bold py-3 rounded-xl text-center transition-colors shadow-sm block"
                            >
                                {isWaitlist ? "Join Waitlist via Whatsapp" : "Order via Whatsapp"}
                            </a>
                        ) : (
                            <button
                                disabled
                                className="w-full bg-gray-400 text-white font-bold py-3 rounded-xl text-center cursor-not-allowed shadow-sm block"
                            >
                                Commission Closed
                            </button>
                        )}
                    </div>

                </div>

                {spreadsheet?.url && (
                    <a
                        href={spreadsheet.url}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-8 inline-block text-center text-sm sm:text-base font-semibold text-[#16377D] underline underline-offset-4 hover:text-[#3B82F6] transition-colors"
                    >
                        {spreadsheet.label || "Lihat spreadsheet"}
                    </a>
                )}
            </div>

            {/* Alternative Contact Section */}
            <div className="w-full max-w-5xl flex flex-col mb-12 relative">
                <div className="w-full max-w-5xl z-10">
                    <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-[#16377D] mb-4 sm:mb-6">
                        do not have <span className="font-bold text-[#16377D]">whatsapp</span>?
                    </h3>

                    <div className="w-full md:w-72 bg-[#EBF3FC] border border-[#D0E2FF] rounded-2xl p-5 sm:p-6">
                        <h4 className="text-base font-bold text-[#16377D] mb-4">Contact me on</h4>
                        <div className="space-y-3 font-semibold text-[#16377D]">
                            <div className="flex items-center gap-3">
                                <a
                                    href="https://x.com/raannowe3"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="w-9 h-9 rounded-full bg-white border border-[#D0E2FF] flex items-center justify-center hover:scale-105 transition-transform shadow-sm shrink-0"
                                >
                                    <img src="/webdesign/X-logo.png" alt="X" className="w-7 h-7 object-contain" />
                                </a>
                                <a
                                    href="https://x.com/raannowe3"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="hover:underline"
                                >
                                    <span>raannowe3</span>
                                </a>
                            </div>
                            <div className="flex items-center gap-3">
                                <a
                                    href="https://discord.com"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="w-9 h-9 rounded-full bg-white border border-[#D0E2FF] flex items-center justify-center hover:scale-105 transition-transform shadow-sm shrink-0"
                                >
                                    <img src="/webdesign/discord-logo.png" alt="Discord" className="w-7 h-7 object-contain" />
                                </a>
                                <a
                                    href="https://discord.com"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="hover:underline"
                                >
                                    <span>Vieer_a</span>
                                </a>
                            </div>
                            <div className="flex items-center gap-3">
                                <a
                                    href="https://www.instagram.com/vieer_a?utm_source=ig_web_button_share_sheet&stkn=ZDNlZDc0MzIxNw=="
                                    target="_blank"
                                    rel="noreferrer"
                                    className="w-9 h-9 rounded-full bg-white border border-[#D0E2FF] flex items-center justify-center hover:scale-105 transition-transform shadow-sm shrink-0"
                                >
                                    <img src="/webdesign/Instagram-logo.png" alt="Instagram" className="w-7 h-7 object-contain" />
                                </a>
                                <a
                                    href="https://www.instagram.com/vieer_a?utm_source=ig_web_button_share_sheet&stkn=ZDNlZDc0MzIxNw=="
                                    target="_blank"
                                    rel="noreferrer"
                                    className="hover:underline"
                                >
                                    <span>Vieer_a</span>
                                </a>
                            </div>
                            <div className="flex items-center gap-3">
                                <a
                                    href="https://vgen.co/vieer_a"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="w-9 h-9 rounded-full bg-white border border-[#D0E2FF] flex items-center justify-center hover:scale-105 transition-transform shadow-sm shrink-0"
                                >
                                    <img src="/webdesign/Vgen-logo.png" alt="Instagram" className="w-7 h-7 object-contain" />
                                </a>
                                <a
                                    href="https://vgen.co/vieer_a"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="hover:underline"
                                >
                                    <span>Vieer_a</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Decorative Doodle Accent */}
                <img
                    src="/webdesign/hero-images-2.png"
                    alt="Doodle"
                    className="absolute bottom-0 right-2 sm:right-6 md:right-12 w-24 sm:w-28 md:w-36 object-contain pointer-events-none animate-bounce z-0 opacity-80 sm:opacity-100"
                    style={{ animationDuration: '4s' }}
                />
            </div>

        </div>
    );
}