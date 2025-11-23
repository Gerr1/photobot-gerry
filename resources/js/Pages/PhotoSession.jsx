import React, { useState, useRef, useCallback, useEffect } from 'react';
// Peringatan: Asumsi modul-modul ini sudah terinstal di proyek asli Anda.
import Webcam from 'react-webcam';
import { Head, Link } from '@inertiajs/react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default function PhotoSession({ layoutId, userName }) {
    const webcamRef = useRef(null);
    const collageRef = useRef(null);
    
    const [images, setImages] = useState([]);
    const [isFinished, setIsFinished] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    // STATE BARU: Untuk mengontrol tampilan Preview di mode HP
    const [isMobilePreviewActive, setIsMobilePreviewActive] = useState(false); 

    // Fungsi untuk menghapus foto dari slot
    const removeImage = (indexToRemove) => {
        const newImages = images.filter((_, i) => i !== indexToRemove);
        setImages(newImages);
        // Jika sedang mode 'Finished' dan ada foto yang dihapus, kembalikan ke mode 'Capture'
        if (isFinished && newImages.length < 6) {
            setIsFinished(false);
        }
        // Jika tidak ada foto, otomatis keluar dari mobile preview
        if (newImages.length === 0) {
            setIsMobilePreviewActive(false);
        }
    };

    // --- CONFIG TEMA (Sama dengan Dashboard tapi dengan detail CSS) ---
    const getThemeConfig = (id) => {
        const numId = parseInt(id);
        const configs = {
            1: { name: "Sakura", bg: "bg-pink-100", frame: "border-pink-300", text: "text-pink-600", emoji: "🌸", titleFont: "font-serif" },
            2: { name: "Halloween", bg: "bg-orange-950", frame: "border-orange-600", text: "text-orange-500", emoji: "🎃", titleFont: "font-mono" },
            3: { name: "Ocean", bg: "bg-cyan-100", frame: "border-cyan-500", text: "text-cyan-700", emoji: "🌊", titleFont: "font-sans" },
            4: { name: "Vintage", bg: "bg-[#fdf6e3]", frame: "border-[#8b5e3c]", text: "text-[#8b5e3c]", emoji: "🎞️", titleFont: "font-serif" },
            5: { name: "Cyberpunk", bg: "bg-slate-900", frame: "border-cyan-400", text: "text-cyan-400", emoji: "🤖", titleFont: "font-mono" },
            6: { name: "Christmas", bg: "bg-red-50", frame: "border-green-600", text: "text-red-600", emoji: "🎄", titleFont: "font-serif" },
            7: { name: "Love", bg: "bg-rose-100", frame: "border-red-400", text: "text-red-500", emoji: "❤️", titleFont: "font-serif" },
            8: { name: "Galaxy", bg: "bg-[#1a1a2e]", frame: "border-purple-500", text: "text-purple-300", emoji: "✨", titleFont: "font-mono" },
            9: { name: "Newspaper", bg: "bg-gray-100", frame: "border-black", text: "text-black", emoji: "📰", titleFont: "font-serif" },
            10: { name: "Rainbow", bg: "bg-yellow-50", frame: "border-purple-400", text: "text-purple-600", emoji: "🌈", titleFont: "font-sans" },
            // ... (Tema default untuk sisanya)
        };
        return configs[numId] || { name: "Classic", bg: "bg-white", frame: "border-gray-800", text: "text-gray-800", emoji: "📸", titleFont: "font-sans" };
    };

    const theme = getThemeConfig(layoutId);

    const videoConstraints = { width: 720, height: 720, facingMode: "user" };

    const capture = useCallback(() => {
        const imageSrc = webcamRef.current.getScreenshot();
        if (images.length < 6) setImages([...images, imageSrc]);
    }, [webcamRef, images]);

    const downloadResult = async (format) => {
        if (!collageRef.current) return;
        setIsProcessing(true);
        try {
            // Setup html2canvas
            const canvas = await html2canvas(collageRef.current, {
                scale: 2,
                useCORS: true,
                backgroundColor: null,
            });
            const fileName = `${theme.name}_${userName}_${Date.now()}`;

            if (format === 'pdf') {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF('p', 'mm', 'a4');
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
                pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
                pdf.save(`${fileName}.pdf`);
            } else {
                const link = document.createElement('a');
                link.download = `${fileName}.${format}`;
                link.href = canvas.toDataURL(`image/${format}`, format === 'jpeg' ? 0.9 : 1.0);
                link.click();
            }
        } catch (error) {
            console.error("Gagal download:", error);
            // Mengganti alert() dengan pesan di console
            console.log("Gagal download: Periksa konsol untuk detail error.");
        }
        setIsProcessing(false);
    };

    const getGridClass = () => {
        const id = parseInt(layoutId);
        if (id % 4 === 0) return "grid-cols-2 gap-4 p-8";
        if (id % 4 === 1) return "grid-cols-3 gap-2 p-4";
        if (id % 4 === 2) return "grid-cols-3 gap-y-4 gap-x-1 p-2";
        return "grid-cols-2 gap-1 p-2";
    };

    // Fungsi render Kolase (Preview) dipisah agar bisa digunakan di desktop dan mobile
    const renderCollage = (isMobileView = false) => (
        <div 
            // Kita tidak bisa menggunakan collageRef di sini karena function component akan dipanggil 2x
            // Kita hanya akan menggunakan collageRef pada div yang TERCETAK (yaitu yang di desktop atau ketika finished)
            ref={!isFinished && isMobilePreviewActive ? null : collageRef} 
            className={`relative shadow-2xl overflow-hidden transition-all duration-500 ${theme.bg}`}
            // Ukuran Kolase di Mobile dipaksa lebih kecil agar tidak terlalu tinggi
            style={{ minHeight: isMobileView ? '400px' : '600px' }} 
        >
            {/* DEKORASI POJOK (Emoji sesuai tema) */}
            <div className="absolute top-2 left-2 text-4xl opacity-80 z-10">{theme.emoji}</div>
            <div className="absolute top-2 right-2 text-4xl opacity-80 z-10 transform scale-x-[-1]">{theme.emoji}</div>
            <div className="absolute bottom-2 left-2 text-4xl opacity-80 z-10">{theme.emoji}</div>
            <div className="absolute bottom-2 right-2 text-4xl opacity-80 z-10 transform scale-x-[-1]">{theme.emoji}</div>

            {/* HEADER KOLASE */}
            <div className="text-center py-6 relative z-10">
                <h1 className={`text-3xl sm:text-4xl font-bold tracking-wider uppercase ${theme.text} ${theme.titleFont}`}>
                    {theme.name} Memories
                </h1>
                <p className={`text-xs sm:text-sm opacity-70 mt-1 font-semibold tracking-widest ${theme.text}`}>
                    PHOTOBOT X {userName.toUpperCase()}
                </p>
            </div>

            {/* GRID FOTO */}
            <div className={`grid ${getGridClass()} relative z-10`}>
                {[...Array(6)].map((_, index) => (
                    <div 
                        key={index} 
                        className={`relative aspect-square overflow-hidden border-4 ${theme.frame} bg-white/50 backdrop-blur-sm shadow-sm transform rotate-0 hover:rotate-1 transition-transform duration-300`}
                    >
                        {images[index] ? (
                            <>
                                <img 
                                    src={images[index]} 
                                    className="w-full h-full object-cover filter contrast-110" 
                                    alt={`Foto ke-${index + 1}`}
                                />
                                {/* Tombol Hapus: Selalu tampil saat belum selesai (isFinished=false) */}
                                {!isFinished && (
                                    <button 
                                        onClick={() => removeImage(index)}
                                        className="absolute inset-0 bg-red-500/50 opacity-0 hover:opacity-100 flex items-center justify-center text-white font-bold text-2xl transition-opacity cursor-pointer"
                                        title="Hapus foto ini"
                                    >
                                        ❌
                                    </button>
                                )}
                            </>
                        ) : (
                            <div className={`w-full h-full flex items-center justify-center text-4xl opacity-30 ${theme.text}`}>
                                {index + 1}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* FOOTER KOLASE */}
            <div className="pb-4 pt-4 text-center">
                <div className={`text-[10px] font-mono opacity-60 ${theme.text}`}>
                    {new Date().toLocaleDateString()} • {new Date().toLocaleTimeString()} • #{layoutId}
                </div>
            </div>
        </div>
    );

    // --- MAIN RENDER ---
    return (
        <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center py-6">
            <Head title={`Sesi Foto ${theme.name}`} />

            {/* NAVIGASI ATAS */}
            <div className="w-full max-w-5xl flex justify-between items-center px-4 mb-4">
                <Link href="/dashboard" data={{ name: userName }} className="text-gray-400 hover:text-white transition">
                    ← Ganti Tema
                </Link>
                <div className="text-right">
                    <p className="text-sm text-gray-400">Model</p>
                    <h2 className="text-xl font-bold text-pink-500">{userName}</h2>
                </div>
            </div>

            <div className="w-full max-w-6xl flex flex-col md:flex-row gap-8 px-4 justify-center items-start">
                
                {/* ------------------------------------------- */}
                {/* --- AREA KAMERA & KONTROL (Utama HP/Kiri PC) --- */}
                {/* ------------------------------------------- */}
                {/* Sembunyikan Webcam jika Finished ATAU Mobile Preview Aktif */}
                {(!isFinished && !isMobilePreviewActive) && (
                    <div className="flex-1 flex flex-col items-center w-full">
                        <div className="relative rounded-3xl overflow-hidden shadow-[0_0_30px_rgba(236,72,153,0.3)] border-4 border-slate-700 w-full max-w-md bg-black aspect-square">
                            {images.length < 6 ? (
                                <Webcam
                                    audio={false}
                                    ref={webcamRef}
                                    screenshotFormat="image/jpeg"
                                    videoConstraints={videoConstraints}
                                    className="w-full h-full object-cover transform scale-x-[-1]"
                                />
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center bg-slate-800 text-center p-4">
                                    <span className="text-6xl mb-4">🎉</span>
                                    <p className="text-xl font-bold">Foto Lengkap!</p>
                                    <p className="text-sm text-gray-400">Siap untuk dicetak?</p>
                                </div>
                            )}
                        </div>

                        {/* KONTROL KAMERA */}
                        <div className="mt-6 flex flex-col items-center gap-4">
                            {images.length < 6 ? (
                                <button 
                                    onClick={capture}
                                    className="w-20 h-20 rounded-full bg-white border-[6px] border-gray-300 hover:border-pink-500 hover:scale-110 transition-all duration-200 shadow-xl focus:outline-none focus:ring-4 focus:ring-pink-500/50"
                                    aria-label="Ambil foto"
                                ></button>
                            ) : (
                                <button 
                                    onClick={() => setIsFinished(true)}
                                    className="px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold rounded-full shadow-lg text-lg animate-bounce transition-all duration-300"
                                >
                                    Lihat Hasil Akhir ✨
                                </button>
                            )}
                            
                            <p className="text-slate-500 font-medium">
                                {images.length}/6 Foto Terambil
                            </p>
                            
                            {/* TOMBOL PREVIEW MOBILE (Hanya saat di mode ambil foto & ada foto) */}
                            {images.length > 0 && images.length < 6 && (
                                <button 
                                    onClick={() => setIsMobilePreviewActive(true)}
                                    className="md:hidden mt-2 px-6 py-2 bg-slate-700 hover:bg-slate-600 text-sm rounded-full transition shadow-md"
                                >
                                    Lihat Preview ({images.length})
                                </button>
                            )}
                        </div>
                    </div>
                )}
                
                {/* ------------------------------------------- */}
                {/* --- AREA HASIL / KOLASE (Preview Desktop/Mobile) --- */}
                {/* ------------------------------------------- */}
                <div 
                    // Tampilkan jika Finished ATAU Mobile Preview Aktif. Di desktop, selalu tampil sebagai sidebar.
                    className={`${isFinished || isMobilePreviewActive ? 'w-full max-w-3xl' : 'hidden md:block w-1/3'}`}
                >
                    
                    {/* Tombol kembali ke Webcam (Hanya di HP, jika Preview Aktif) */}
                    {isMobilePreviewActive && !isFinished && (
                        <button 
                            onClick={() => setIsMobilePreviewActive(false)}
                            className="md:hidden mb-4 px-4 py-2 bg-pink-600 hover:bg-pink-500 text-white rounded-lg font-bold w-full transition shadow-lg"
                        >
                            ← Kembali ke Kamera ({6 - images.length} tersisa)
                        </button>
                    )}

                    {/* KANVAS KOLASE */}
                    {/* Render collageRef hanya di area yang akan di-screenshot (desktop atau mode finished) */}
                    <div ref={!isFinished && isMobilePreviewActive ? null : collageRef}>
                        {renderCollage(true)} {/* Pass true untuk style mobile/preview */}
                    </div>

                    {/* TOMBOL ACTION (Download/Reset) */}
                    {isFinished && (
                        <div className="mt-8 bg-slate-800 p-6 rounded-2xl border border-slate-700 text-center animate-fade-in-up">
                            <h3 className="text-white text-lg mb-4 font-medium">Simpan kenangan indah ini:</h3>
                            
                            {isProcessing ? (
                                <div className="text-pink-400 animate-pulse font-bold">Sedang mencetak... Tunggu sebentar 🖨️</div>
                            ) : (
                                <div className="flex flex-wrap justify-center gap-4">
                                    <button onClick={() => downloadResult('jpeg')} className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold shadow-lg transition">
                                        JPG (HP)
                                    </button>
                                    <button onClick={() => downloadResult('png')} className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold shadow-lg transition">
                                        PNG (HD)
                                    </button>
                                    <button onClick={() => downloadResult('pdf')} className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold shadow-lg transition">
                                        PDF (Dokumen)
                                    </button>
                                    <button onClick={() => { setImages([]); setIsFinished(false); setIsMobilePreviewActive(false); }} className="px-6 py-3 bg-gray-600 hover:bg-gray-500 text-white rounded-xl font-bold shadow-lg transition">
                                        Ulangi 🔄
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
