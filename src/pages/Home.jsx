import { useState } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";

export default function Home() {
    const { commissionStatus, commissionData, artworks } = useApp();

    // Artwork 16:9 untuk bagian "latest artwork"
    const latestArtworks = artworks
        .filter((artwork) => artwork.ratio === "16:9")
        .slice(0, 3);

    // Data komisi disesuaikan agar konsisten
    const commissionTypes = [
        { name: "Bust Up", price: "Rp 70k / $15" },
        { name: "Half Body", price: "Rp 90k / $20" },
        { name: "Knee Up", price: "Rp 120k / $25" },
        { name: "Full Body", price: "Rp 150k / $35" },
    ];

    const commissionArtworks = artworks
        .filter((artwork) => artwork.ratio === "4:5")
        .slice(0, 4);

    const [currentSlide, setCurrentSlide] = useState(0);

    return (
        <main className="min-h-screen bg-[#F2F9FD] text-[#16377D] pb-16 sm:pb-24 font-sans overflow-x-hidden ">

            {/* =====================================================
                HERO SECTION
            ====================================================== */}
            <section className="relative mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-[9%] py-8 sm:py-16 flex flex-col md:flex-row items-center justify-between gap-8">

                {/* Text Content */}
                <div className="z-10 w-full md:max-w-[580px] text-center md:text-left">
                    <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold leading-tight">
                        Hey-O! Fellas. <br />
                        Thank you for stopping in my commission!
                    </h1>

                    <p className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl leading-relaxed text-[#16377D]/90 max-w-[460px] mx-auto md:mx-0">
                        Ready to bring your favorite characters to life? Check out my commission details and let's create something cute together.
                    </p>

                    <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center md:justify-start gap-3 sm:gap-4">
                        <Link
                            to="/commission"
                            className="w-full sm:w-auto text-center px-7 py-3.5 bg-[#2563EB] hover:bg-[#3B82F6] text-white font-bold rounded-full shadow-md transition-all hover:scale-105"
                        >
                            Open Commission Info
                        </Link>
                        <Link
                            to="/gallery"
                            className="w-full sm:w-auto text-center px-7 py-3.5 border border-[#A9D4FF] hover:bg-[#E5F3FF] font-semibold rounded-full transition-all"
                        >
                            View Gallery
                        </Link>
                    </div>
                </div>

                {/* Main Character Illustration (Sembunyi di HP, Sejajar Presisi di Desktop) */}
                <div className="hidden md:flex relative justify-center items-center w-1/2">
                    <img
                        src="/webdesign/hero-images.png"
                        alt="Hero Main Character"
                        className="w-full max-w-[380px] object-contain drop-shadow-lg transition-transform duration-300 hover:scale-102"
                    />
                </div>
            </section>


            {/* =====================================================
                LATEST ARTWORK (CAROUSEL - Lock Rasio 16:9 Tanpa Crop)
            ====================================================== */}
            <section className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-[6%] mt-8 sm:mt-16">

                <h2 className="text-center text-xl sm:text-2xl md:text-3xl font-normal">
                    Check out my <span className="font-bold">latest</span> artwork.
                </h2>

                <div className="relative mx-auto mt-6 sm:mt-8 w-full max-w-[1100px]">

                    {/* Slider Window (Kunci Aspek Rasio 16:9) */}
                    <div className="overflow-hidden rounded-2xl shadow-sm border border-[#D0E2FF] bg-white aspect-[16/9] w-full">
                        <div
                            className="flex transition-transform duration-500 ease-in-out h-full"
                            style={{
                                transform: `translateX(-${currentSlide * 100}%)`,
                            }}
                        >
                            {latestArtworks.map((artwork) => (
                                <div key={artwork.id} className="min-w-full shrink-0 h-full bg-white flex items-center justify-center">
                                    <img
                                        src={artwork.image}
                                        alt={artwork.title || "Latest Artwork"}
                                        className="w-full h-full object-contain aspect-[16/9]"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Navigation Buttons */}
                    <button
                        onClick={() =>
                            setCurrentSlide(
                                currentSlide === 0
                                    ? latestArtworks.length - 1
                                    : currentSlide - 1
                            )
                        }
                        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-2 rounded-full shadow-md transition-all hover:scale-110 cursor-pointer"
                        aria-label="Previous artwork"
                    >
                        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-[#16377D]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    <button
                        onClick={() =>
                            setCurrentSlide(
                                currentSlide === latestArtworks.length - 1
                                    ? 0
                                    : currentSlide + 1
                            )
                        }
                        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-2 rounded-full shadow-md transition-all hover:scale-110 cursor-pointer"
                        aria-label="Next artwork"
                    >
                        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-[#16377D]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>

                </div>

                {/* Slider Dots */}
                <div className="mt-4 sm:mt-5 flex justify-center gap-2">
                    {latestArtworks.map((artwork, index) => (
                        <button
                            key={artwork.id}
                            onClick={() => setCurrentSlide(index)}
                            aria-label={`Go to slide ${index + 1}`}
                            className={`h-2.5 rounded-full transition-all cursor-pointer ${currentSlide === index
                                ? "w-8 bg-[#16377D]"
                                : "w-2.5 bg-[#BBD7EE]"
                                }`}
                        />
                    ))}
                </div>

                {/* Gallery Link */}
                <div className="mt-6 sm:mt-8 flex justify-center">
                    <Link
                        to="/gallery"
                        className="inline-flex items-center gap-3 px-6 py-3 rounded-full border border-[#A9D4FF] hover:bg-[#E5F3FF] font-medium transition-all text-sm sm:text-base"
                    >
                        <span>Check my full gallery</span>
                        <span className="flex h-6 w-6 items-center justify-center overflow-hidden rounded-full">
                            <img
                                src="/webdesign/arrow_circle_right.png"
                                alt="Next artwork"
                                className="h-full w-full object-contain"
                            />
                        </span>
                    </Link>
                </div>

            </section>


            {/* =====================================================
                COMMISSION PREVIEW SECTION (Lock Rasio 4:5 Tanpa Crop)
            ====================================================== */}
            <section className="mx-auto mt-16 sm:mt-24 w-full max-w-[1440px] px-5 sm:px-6 lg:px-[6%]">

                <div className="text-center">
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold">
                        Commission Status :{" "}
                        <span className={`font-bold ${commissionStatus === "OPEN" ? "text-[#3B82F6]" : "text-red-500"}`}>
                            {commissionStatus}
                        </span>
                    </h2>
                    <p className="text-xs sm:text-sm md:text-base text-[#16377D]/80 mt-1">
                        Here are some samples of commission categories.
                    </p>
                </div>

                {/* Grid Preview (Rasio Asli 4:5 Dijaga) */}
                <div className="mx-auto mt-8 sm:mt-10 grid max-w-[1100px] grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    {commissionArtworks.map((artwork, index) => (
                        <div
                            key={artwork.id}
                            className="group flex flex-col cursor-default"
                        >
                            {/* Container Gambar Kunci 4:5 + Object Contain */}
                            <div className="overflow-hidden rounded-2xl aspect-[5/4] bg-gray-100 border border-[#D0E2FF] flex items-center justify-center">
                                <img
                                    src={artwork.image}
                                    alt={artwork.title}
                                    className="w-full h-full object-contain transition-transform duration-500 ease-out group-hover:scale-105"
                                />
                            </div>

                            {/* Text Info Below Image */}
                            <div className="mt-2.5 sm:mt-3 px-1">
                                <h3 className="font-bold text-sm sm:text-base text-[#16377D]">
                                    {commissionTypes[index]?.name || "Commission"}
                                </h3>
                                <p className="text-xs sm:text-sm font-semibold text-[#3B82F6]">
                                    {commissionTypes[index]?.price || "Ask for price"}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Commission CTA Button */}
                <div className="mt-8 sm:mt-12 flex justify-center">
                    <Link
                        to="/commission"
                        className="inline-flex items-center gap-3 px-7 sm:px-8 py-3.5 rounded-full bg-[#3B82F6] text-white font-bold hover:bg-[#2563EB] transition-all shadow-md hover:scale-105 text-sm sm:text-base"
                    >
                        <span>View Commission Details</span>
                        <span>→</span>
                    </Link>
                </div>

            </section>


            {/* =====================================================
                HOW TO ORDER
            ====================================================== */}
            <section className="mx-auto mt-16 sm:mt-24 lg:mt-28 w-full max-w-[1100px] px-5 sm:px-6">

                <div className="text-center mb-8 sm:mb-12">
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#16377D] mt-3">
                        How To Order
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 relative">

                    {/* Step 1 */}
                    <div className="flex flex-col items-start p-5 sm:p-7 rounded-2xl bg-white/70 border border-[#D0E2FF] hover:border-[#3B82F6] transition-all duration-300 hover:shadow-md">
                        <span className="text-3xl sm:text-4xl font-black text-[#3B82F6]/30 mb-2 sm:mb-3">
                            01
                        </span>
                        <h3 className="font-bold text-base sm:text-lg text-[#16377D] mb-1">
                            Send Details
                        </h3>
                        <p className="text-xs sm:text-sm text-[#16377D]/75 leading-relaxed">
                            Reach out via WhatsApp or X with your character references, pose ideas, and desired category.
                        </p>
                    </div>

                    {/* Step 2 */}
                    <div className="flex flex-col items-start p-5 sm:p-7 rounded-2xl bg-white/70 border border-[#D0E2FF] hover:border-[#3B82F6] transition-all duration-300 hover:shadow-md">
                        <span className="text-3xl sm:text-4xl font-black text-[#3B82F6]/30 mb-2 sm:mb-3">
                            02
                        </span>
                        <h3 className="font-bold text-base sm:text-lg text-[#16377D] mb-1">
                            Sketch & Payment
                        </h3>
                        <p className="text-xs sm:text-sm text-[#16377D]/75 leading-relaxed">
                            I'll send a rough sketch for approval. Payment is processed once lineart stage is approved.
                        </p>
                    </div>

                    {/* Step 3 */}
                    <div className="flex flex-col items-start p-5 sm:p-7 rounded-2xl bg-white/70 border border-[#D0E2FF] hover:border-[#3B82F6] transition-all duration-300 hover:shadow-md">
                        <span className="text-3xl sm:text-4xl font-black text-[#3B82F6]/30 mb-2 sm:mb-3">
                            03
                        </span>
                        <h3 className="font-bold text-base sm:text-lg text-[#16377D] mb-1">
                            Final Delivery
                        </h3>
                        <p className="text-xs sm:text-sm text-[#16377D]/75 leading-relaxed">
                            Once fully rendered, high-resolution files will be sent straight to your email.
                        </p>
                    </div>

                </div>

            </section>

        </main>
    );
}