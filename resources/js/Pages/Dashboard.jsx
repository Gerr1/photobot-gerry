import React from "react";
import { Link, Head } from "@inertiajs/react";

export default function Dashboard({ userName }) {
    // DATA 20 TEMA UNIK
    const themes = [
        {
            id: 1,
            name: "Sakura Season",
            emoji: "🌸",
            bg: "bg-pink-100",
            border: "border-pink-300",
            desc: "Nuansa musim semi Jepang",
        },
        {
            id: 2,
            name: "Spooky Halloween",
            emoji: "🎃",
            bg: "bg-orange-900",
            border: "border-orange-500",
            desc: "Seram tapi lucu!",
            text: "text-orange-100",
        },
        {
            id: 3,
            name: "Ocean Blue",
            emoji: "🌊",
            bg: "bg-blue-100",
            border: "border-blue-400",
            desc: "Segar seperti pantai",
        },
        {
            id: 4,
            name: "Vintage 90s",
            emoji: "🎞️",
            bg: "bg-amber-100",
            border: "border-yellow-700",
            desc: "Klasik & Nostalgia",
        },
        {
            id: 5,
            name: "Neon Cyberpunk",
            emoji: "🤖",
            bg: "bg-slate-900",
            border: "border-cyan-400",
            desc: "Futuristik menyala",
            text: "text-cyan-400",
        },
        {
            id: 6,
            name: "Christmas Joy",
            emoji: "🎄",
            bg: "bg-red-50",
            border: "border-green-600",
            desc: "Suasana Natal hangat",
        },
        {
            id: 7,
            name: "Love Letter",
            emoji: "💌",
            bg: "bg-rose-50",
            border: "border-red-300",
            desc: "Romantis abis",
        },
        {
            id: 8,
            name: "Galaxy Space",
            emoji: "🚀",
            bg: "bg-indigo-950",
            border: "border-purple-500",
            desc: "Menjelajah angkasa",
            text: "text-white",
        },
        {
            id: 9,
            name: "Newspaper",
            emoji: "📰",
            bg: "bg-gray-100",
            border: "border-black",
            desc: "Gaya koran hitam putih",
        },
        {
            id: 10,
            name: "Rainbow Fun",
            emoji: "🌈",
            bg: "bg-yellow-50",
            border: "border-purple-300",
            desc: "Warna-warni ceria",
        },
        {
            id: 11,
            name: "Forest Camp",
            emoji: "🌲",
            bg: "bg-green-100",
            border: "border-green-700",
            desc: "Alam yang tenang",
        },
        {
            id: 12,
            name: "Luxury Gold",
            emoji: "👑",
            bg: "bg-slate-800",
            border: "border-yellow-400",
            desc: "Mewah & Elegan",
            text: "text-yellow-400",
        },
        {
            id: 13,
            name: "Comic Book",
            emoji: "💥",
            bg: "bg-white",
            border: "border-black",
            desc: "Gaya komik pop art",
        },
        {
            id: 14,
            name: "Polaroid",
            emoji: "📸",
            bg: "bg-white",
            border: "border-gray-200 shadow-xl",
            desc: "Foto instan klasik",
        },
        {
            id: 15,
            name: "Coffee Time",
            emoji: "☕",
            bg: "bg-orange-50",
            border: "border-orange-800",
            desc: "Hangat seperti kopi",
        },
        {
            id: 16,
            name: "Baby Cloud",
            emoji: "☁️",
            bg: "bg-sky-50",
            border: "border-sky-200",
            desc: "Lembut & Cute",
        },
        {
            id: 17,
            name: "Cat Lover",
            emoji: "🐱",
            bg: "bg-orange-50",
            border: "border-orange-300",
            desc: "Untuk pecinta kucing",
        },
        {
            id: 18,
            name: "Dark Gothic",
            emoji: "🦇",
            bg: "bg-black",
            border: "border-red-900",
            desc: "Gelap & Misterius",
            text: "text-red-700",
        },
        {
            id: 19,
            name: "Summer Fruit",
            emoji: "🍉",
            bg: "bg-green-50",
            border: "border-red-400",
            desc: "Segar buah-buahan",
        },
        {
            id: 20,
            name: "Minimalist",
            emoji: "✨",
            bg: "bg-gray-50",
            border: "border-gray-400",
            desc: "Simpel & Bersih",
        },
    ];

    return (
        <div className="min-h-screen bg-slate-900 p-8 font-sans">
            <Head title="Pilih Tema" />

            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                        Halo,{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
                            {userName}!
                        </span>{" "}
                        👋
                    </h1>
                    <p className="text-gray-400 text-lg">
                        Pilih tema mood kamu hari ini untuk 6 foto spesial.
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {themes.map((theme) => (
                        <Link
                            key={theme.id}
                            href={`/photo-session/${theme.id}`}
                            data={{ name: userName }} // Kirim nama via query param
                            className={`relative group overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${theme.bg} border-4 ${theme.border}`}
                        >
                            <div className="p-6 flex flex-col items-center justify-center h-full text-center relative z-10">
                                <div className="text-6xl mb-4 transform group-hover:scale-125 transition-transform duration-300">
                                    {theme.emoji}
                                </div>
                                <h3
                                    className={`font-black text-xl mb-2 ${
                                        theme.text || "text-slate-800"
                                    }`}
                                >
                                    {theme.name}
                                </h3>
                                <p
                                    className={`text-xs font-medium opacity-70 ${
                                        theme.text || "text-slate-700"
                                    }`}
                                >
                                    {theme.desc}
                                </p>

                                <div className="mt-4 px-4 py-2 bg-white/30 backdrop-blur-sm rounded-full text-xs font-bold uppercase tracking-wider group-hover:bg-white group-hover:text-black transition-colors">
                                    Pilih Ini
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
