import { useState } from 'react';
import { Head, router } from '@inertiajs/react';

export default function Welcome() {
    const [name, setName] = useState('');
    const [showInput, setShowInput] = useState(false);

    const handleStart = (e) => {
        e.preventDefault();
        if (!name.trim()) return alert("Tulis namamu dulu dong! 😊");
        
        // Pindah ke dashboard membawa data nama
        router.get('/dashboard', { name: name });
    };

    return (
        <>
            <Head title="Selamat Datang" />
            <div className="min-h-screen bg-slate-900 relative overflow-hidden flex flex-col items-center justify-center font-sans">
                
                {/* --- BACKGROUND ANIMASI --- */}
                <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

                {/* --- KONTEN UTAMA --- */}
                <div className="relative z-10 max-w-4xl w-full text-center px-6">
                    <h1 className="text-6xl md:text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400 mb-6 drop-shadow-lg animate-fade-in-down">
                        PhotoBot
                    </h1>
                    <p className="text-xl md:text-2xl text-slate-300 font-light mb-12 animate-fade-in-up">
                        "Mari buat kenangan dengan orang yang tersayang dengan <span className="text-pink-400 font-bold">PHOTOBOT</span>"
                    </p>

                    {/* Logic Tombol / Input Nama */}
                    {!showInput ? (
                        <button
                            onClick={() => setShowInput(true)}
                            className="group relative inline-flex items-center justify-center px-10 py-5 text-xl font-bold text-white bg-pink-600 rounded-full hover:bg-pink-700 hover:scale-105 transition-all shadow-[0_0_20px_rgba(236,72,153,0.7)] animate-bounce-slow"
                        >
                            AYO PHOTOBOT!! 📸
                        </button>
                    ) : (
                        <form onSubmit={handleStart} className="flex flex-col items-center gap-4 animate-fade-in-up">
                            <input
                                type="text"
                                placeholder="Siapa namamu?"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="px-6 py-4 text-center text-xl rounded-full bg-white/10 border-2 border-pink-500 text-white placeholder-slate-400 focus:outline-none focus:bg-white/20 w-80 backdrop-blur-sm transition-all"
                                autoFocus
                            />
                            <button
                                type="submit"
                                className="px-8 py-3 bg-purple-600 text-white rounded-full font-bold hover:bg-purple-700 transition shadow-lg transform hover:-translate-y-1"
                            >
                                Lanjut 🚀
                            </button>
                        </form>
                    )}
                </div>

                {/* --- FOOTER COPYRIGHT (BARU) --- */}
                <div className="absolute bottom-6 left-0 w-full text-center opacity-60 hover:opacity-100 transition-opacity duration-300">
                    <p className="text-white font-mono text-sm tracking-widest">
                        &copy; Gerry <span className="text-pink-500">X</span> PhotoBot
                    </p>
                    <p className="text-slate-500 text-xs mt-1 font-bold">
                        2025
                    </p>
                </div>

            </div>
        </>
    );
}