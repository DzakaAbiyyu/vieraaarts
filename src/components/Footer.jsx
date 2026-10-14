import { Link } from "react-router-dom";

export default function Footer() {
    return (
        <footer className="w-full bg-[#EBF3FC] border-t border-[#D0E2FF] py-8 sm:py-10 px-5 sm:px-8 mt-auto">
            <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">

                {/* Branding & Logo */}
                <div className="flex flex-col items-center md:items-start text-center md:text-left">
                    <img
                        src="/webdesign/logo.png"
                        alt="Mrvieen Illustration"
                        className="h-8 object-contain mb-1"
                    />
                    <p className="text-xs text-[#16377D] font-medium opacity-80">
                        Anime & Character Illustrator
                    </p>
                </div>

                {/* Quick Links */}
                <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm font-semibold text-[#16377D]">
                    <Link to="/" className="hover:opacity-75 transition-opacity py-1">
                        Home
                    </Link>
                    <Link to="/gallery" className="hover:opacity-75 transition-opacity py-1">
                        My Gallery
                    </Link>
                    <Link to="/commission" className="hover:opacity-75 transition-opacity py-1">
                        Commission
                    </Link>
                </div>

                {/* Social Icons */}
                <div className="flex items-center gap-3">
                    <a
                        href="https://x.com/Vieer430"
                        target="_blank"
                        rel="noreferrer"
                        className="w-9 h-9 rounded-full bg-white border border-[#D0E2FF] flex items-center justify-center hover:scale-105 active:scale-95 transition-transform shadow-xs"
                        aria-label="X Profile"
                    >
                        <img src="/webdesign/X-logo.png" alt="X" className="w-4 h-4 object-contain" />
                    </a>
                    <a
                        href="https://www.instagram.com/vieer_a?utm_source=ig_web_button_share_sheet&stkn=ZDNlZDc0MzIxNw=="
                        target="_blank"
                        rel="noreferrer"
                        className="w-9 h-9 rounded-full bg-white border border-[#D0E2FF] flex items-center justify-center hover:scale-105 active:scale-95 transition-transform shadow-xs"
                        aria-label="Instagram Profile"
                    >
                        <img src="/webdesign/Instagram-logo.png" alt="Instagram" className="w-4 h-4 object-contain" />
                    </a>
                    <a
                        href="https://vgen.co/vieer_a"
                        target="_blank"
                        rel="noreferrer"
                        className="w-9 h-9 rounded-full bg-white border border-[#D0E2FF] flex items-center justify-center hover:scale-105 active:scale-95 transition-transform shadow-xs"
                        aria-label="Vgen Profile"
                    >
                        <img src="/webdesign/Vgen-logo.png" alt="Vgen" className="w-4 h-4 object-contain" />
                    </a>
                </div>

            </div>

            {/* Copyright Line */}
            <div className="max-w-5xl mx-auto mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-[#D0E2FF]/60 text-center text-xs text-[#16377D] font-medium opacity-70">
                <Link
                    to="/login"
                    tabIndex={-1}
                    aria-hidden="true"
                    className="cursor-default select-none px-1"
                >
                    ©
                </Link>{" "}
                {new Date().getFullYear()} Mrvieera Illustration. All rights reserved.
            </div>
        </footer>
    );
}