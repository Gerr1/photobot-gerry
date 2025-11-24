import React, { useState, useRef, useEffect, useCallback } from "react";

// --- IKON SVG MANUAL (Supaya tidak perlu install lucide-react) ---
const IconCamera = ({ className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
        <circle cx="12" cy="13" r="3" />
    </svg>
);
const IconDownload = ({ className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
);
const IconRefresh = ({ className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
        <path d="M3 3v5h5" />
        <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
        <path d="M16 16h5v5" />
    </svg>
);
const IconTrash = ({ className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        <line x1="10" y1="11" x2="10" y2="17" />
        <line x1="14" y1="11" x2="14" y2="17" />
    </svg>
);

// --- KONFIGURASI TEMA ---
const getThemeConfig = (id) => {
    const numId = parseInt(id);
    const configs = {
        1: {
            name: "Sakura",
            bg: "bg-pink-50",
            frame: "border-pink-300",
            text: "text-pink-600",
            emoji: "🌸",
            button: "bg-pink-500 hover:bg-pink-600",
        },
        2: {
            name: "Halloween",
            bg: "bg-orange-950",
            frame: "border-orange-600",
            text: "text-orange-500",
            emoji: "🎃",
            button: "bg-orange-600 hover:bg-orange-700",
        },
        3: {
            name: "Ocean",
            bg: "bg-cyan-50",
            frame: "border-cyan-500",
            text: "text-cyan-700",
            emoji: "🌊",
            button: "bg-cyan-600 hover:bg-cyan-700",
        },
        4: {
            name: "Vintage",
            bg: "bg-amber-50",
            frame: "border-amber-700",
            text: "text-amber-800",
            emoji: "🎞️",
            button: "bg-amber-700 hover:bg-amber-800",
        },
        5: {
            name: "Cyberpunk",
            bg: "bg-slate-900",
            frame: "border-neon-blue",
            text: "text-cyan-400",
            emoji: "🤖",
            button: "bg-cyan-600 hover:bg-cyan-500",
        },
    };
    return configs[numId] || configs[1];
};

const PhotoSession = ({ layoutId = 1, userName = "Guest" }) => {
    // --- STATE ---
    const theme = getThemeConfig(layoutId);
    const [images, setImages] = useState(Array(6).fill(null)); // Array 6 slot kosong
    const [stream, setStream] = useState(null);
    const [timerDuration, setTimerDuration] = useState(3); // Default 3 detik
    const [countdown, setCountdown] = useState(null); // Nilai hitung mundur saat ini
    const [isCapturing, setIsCapturing] = useState(false);
    const [retakeIndex, setRetakeIndex] = useState(null); // Index mana yang sedang difoto ulang
    const [error, setError] = useState(null);

    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    // --- 1. INISIALISASI KAMERA ---
    useEffect(() => {
        const startCamera = async () => {
            try {
                const mediaStream = await navigator.mediaDevices.getUserMedia({
                    video: {
                        width: { ideal: 1280 },
                        height: { ideal: 720 },
                        facingMode: "user",
                    },
                    audio: false,
                });
                setStream(mediaStream);
                if (videoRef.current) {
                    videoRef.current.srcObject = mediaStream;
                }
            } catch (err) {
                console.error("Error akses kamera:", err);
                setError("Gagal mengakses kamera. Pastikan izin diberikan.");
            }
        };

        startCamera();

        return () => {
            if (stream) stream.getTracks().forEach((track) => track.stop());
        };
    }, []);

    // --- 2. LOGIKA TIMER & CAPTURE ---
    useEffect(() => {
        if (countdown === null) return;

        if (countdown > 0) {
            const timerId = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timerId);
        } else {
            // Waktu habis, ambil foto
            takePhoto();
            setCountdown(null);
            setIsCapturing(false);
        }
    }, [countdown]);

    const startCountdown = (indexToFill = null) => {
        if (isCapturing) return;

        // Tentukan slot mana yang akan diisi
        let targetIndex = indexToFill;

        // Jika tidak ada index spesifik (mode normal), cari slot kosong pertama
        if (targetIndex === null) {
            targetIndex = images.findIndex((img) => img === null);
        }

        // Jika penuh dan bukan mode retake, tidak lakukan apa-apa
        if (targetIndex === -1 && indexToFill === null) {
            alert(
                "Grid penuh! Klik foto di preview untuk mengganti foto tertentu."
            );
            return;
        }

        setRetakeIndex(targetIndex); // Simpan index target
        setIsCapturing(true);
        setCountdown(timerDuration);
    };

    const takePhoto = () => {
        if (!videoRef.current || !canvasRef.current) return;

        const video = videoRef.current;
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");

        // Set ukuran canvas sesuai video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // --- PROSES MIRRORING ---
        context.save();
        context.translate(canvas.width, 0);
        context.scale(-1, 1); // Balik horizontal
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        context.restore();
        // ------------------------

        const photoData = canvas.toDataURL("image/jpeg", 0.9);

        setImages((prev) => {
            const newImages = [...prev];
            const idx =
                retakeIndex !== null
                    ? retakeIndex
                    : prev.findIndex((img) => img === null);
            if (idx !== -1) newImages[idx] = photoData;
            return newImages;
        });

        setRetakeIndex(null); // Reset target index
    };

    // --- 3. LOGIKA DOWNLOAD ---
    const handleDownload = () => {
        const printCanvas = document.createElement("canvas");
        const ctx = printCanvas.getContext("2d");
        const width = 800;
        const height = 1200; // Rasio 2:3
        printCanvas.width = width;
        printCanvas.height = height;

        // Background
        ctx.fillStyle = theme.bg.includes("slate") ? "#0f172a" : "#fff1f2";
        ctx.fillRect(0, 0, width, height);

        // Header
        ctx.font = "bold 40px serif";
        ctx.fillStyle = "#333";
        ctx.textAlign = "center";
        ctx.fillText(`${theme.emoji} ${theme.name} Memories`, width / 2, 60);
        ctx.font = "20px sans-serif";
        ctx.fillText(
            `Model: ${userName} • ${new Date().toLocaleDateString()}`,
            width / 2,
            95
        );

        // Gambar Grid
        const cols = 2;
        const rows = 3;
        const pad = 20;
        const cellW = (width - pad * 3) / cols;
        const cellH = cellW; // Kotak persegi

        const validImages = images.filter((img) => img !== null);

        if (validImages.length === 0) {
            alert("Belum ada foto untuk diunduh!");
            return;
        }

        let loadedCount = 0;
        images.forEach((src, i) => {
            if (!src) return;
            const img = new Image();
            img.onload = () => {
                const col = i % cols;
                const row = Math.floor(i / cols);
                const x = pad + col * (cellW + pad);
                const y = 120 + row * (cellH + pad);

                ctx.drawImage(img, x, y, cellW, cellH);
                ctx.strokeStyle = theme.frame.includes("pink")
                    ? "pink"
                    : "gray";
                ctx.lineWidth = 5;
                ctx.strokeRect(x, y, cellW, cellH);

                loadedCount++;
                if (loadedCount === validImages.length) {
                    const link = document.createElement("a");
                    link.download = `${theme.name}_${userName}.jpg`;
                    link.href = printCanvas.toDataURL("image/jpeg");
                    link.click();
                }
            };
            img.src = src;
        });
    };

    const handleReset = () => {
        setImages(Array(6).fill(null));
        setRetakeIndex(null);
    };

    // --- RENDER UTAMA ---
    return (
        <div
            className={`min-h-screen ${theme.bg} p-4 md:p-8 font-sans transition-colors duration-500`}
        >
            {/* Header Sederhana */}
            <div className="max-w-6xl mx-auto mb-6 flex justify-between items-center">
                <h1
                    className={`text-2xl font-bold ${theme.text} flex items-center gap-2`}
                >
                    {theme.emoji} {theme.name} Session
                </h1>
                <div className="text-sm text-gray-500 font-mono bg-white/50 px-3 py-1 rounded-full">
                    Model: {userName}
                </div>
            </div>

            <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">
                {/* --- BAGIAN KIRI: KAMERA --- */}
                <div className="flex-1 flex flex-col items-center">
                    {/* Viewport Kamera */}
                    <div className="relative w-full max-w-lg aspect-[3/4] bg-black rounded-3xl overflow-hidden shadow-2xl border-4 border-white/50 ring-4 ring-gray-100">
                        {error ? (
                            <div className="flex items-center justify-center h-full text-white p-4 text-center">
                                {error}
                            </div>
                        ) : (
                            <>
                                <video
                                    ref={videoRef}
                                    autoPlay
                                    playsInline
                                    muted
                                    // CSS Mirroring untuk preview live
                                    className="w-full h-full object-cover transform scale-x-[-1]"
                                />
                                <canvas ref={canvasRef} className="hidden" />

                                {/* Overlay Countdown */}
                                {countdown !== null && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-20 backdrop-blur-sm">
                                        <div className="text-9xl font-extrabold text-white animate-pulse drop-shadow-lg">
                                            {countdown}
                                        </div>
                                    </div>
                                )}

                                {/* Overlay Indikator Retake */}
                                {retakeIndex !== null && !isCapturing && (
                                    <div className="absolute top-4 left-0 right-0 text-center z-10">
                                        <span className="bg-yellow-400 text-black px-4 py-1 rounded-full font-bold text-sm shadow-lg animate-bounce">
                                            Mengganti Foto #{retakeIndex + 1}
                                        </span>
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    {/* Kontrol Timer */}
                    <div className="mt-6 flex gap-4 bg-white/60 p-2 rounded-full shadow-sm backdrop-blur-md">
                        {[3, 5, 10].map((time) => (
                            <button
                                key={time}
                                onClick={() => setTimerDuration(time)}
                                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                                    timerDuration === time
                                        ? `${theme.button} text-white shadow-lg scale-110`
                                        : "bg-white text-gray-600 hover:bg-gray-100"
                                }`}
                            >
                                {time}s
                            </button>
                        ))}
                    </div>

                    {/* Tombol Shutter Utama */}
                    <button
                        onClick={() => startCountdown(null)}
                        disabled={countdown !== null}
                        className={`mt-6 w-20 h-20 rounded-full border-4 border-white shadow-xl flex items-center justify-center transition-all transform hover:scale-105 active:scale-95 ${
                            countdown !== null
                                ? "bg-gray-400 cursor-not-allowed"
                                : `${theme.button}`
                        }`}
                    >
                        <IconCamera className="w-8 h-8 text-white" />
                    </button>

                    <p className="mt-4 text-gray-500 text-sm">
                        {images.filter((i) => i).length} / 6 Foto Terambil
                    </p>
                </div>

                {/* --- BAGIAN KANAN/BAWAH: PREVIEW GRID (KOLASE) --- */}
                <div className="w-full lg:w-[400px] flex flex-col">
                    <div
                        className={`bg-white p-6 rounded-xl shadow-xl ${theme.frame} border-2`}
                    >
                        <div className="text-center mb-4">
                            <h2
                                className={`font-serif font-bold text-2xl ${theme.text}`}
                            >
                                Preview
                            </h2>
                            <p className="text-xs text-gray-400">
                                Klik foto untuk mengambil ulang
                            </p>
                        </div>

                        {/* GRID 2 Kolom */}
                        <div className="grid grid-cols-2 gap-3">
                            {images.map((img, idx) => (
                                <div
                                    key={idx}
                                    onClick={() => startCountdown(idx)} // Klik untuk Retake spesifik
                                    className={`
                                        aspect-square rounded-lg overflow-hidden border-2 border-dashed 
                                        relative group cursor-pointer transition-all hover:ring-2 ring-offset-2 ring-pink-400
                                        ${
                                            img
                                                ? "border-transparent bg-black"
                                                : "border-gray-300 bg-gray-50"
                                        }
                                    `}
                                >
                                    {img ? (
                                        <>
                                            <img
                                                src={img}
                                                alt={`Slot ${idx}`}
                                                className="w-full h-full object-cover"
                                            />
                                            {/* Hover Overlay Icon */}
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white font-bold text-xs">
                                                <IconRefresh className="w-6 h-6 mb-1" />
                                                <span className="absolute bottom-2">
                                                    Ulangi
                                                </span>
                                            </div>
                                            {/* Badge Nomor */}
                                            <div className="absolute top-1 left-1 bg-black/50 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full">
                                                {idx + 1}
                                            </div>
                                        </>
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-300">
                                            <span className="text-2xl font-bold opacity-20">
                                                {idx + 1}
                                            </span>
                                            <IconCamera className="w-6 h-6 opacity-20 mt-1" />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Tombol Aksi Akhir */}
                    <div className="mt-6 flex flex-col gap-3">
                        <button
                            onClick={handleDownload}
                            disabled={images.filter((i) => i).length === 0}
                            className={`w-full py-4 rounded-xl text-white font-bold shadow-lg flex items-center justify-center gap-2 transition-transform hover:-translate-y-1 ${
                                images.filter((i) => i).length === 0
                                    ? "bg-gray-400"
                                    : "bg-indigo-600 hover:bg-indigo-700"
                            }`}
                        >
                            <IconDownload className="w-5 h-5" /> &nbsp; Simpan /
                            Download
                        </button>

                        <button
                            onClick={handleReset}
                            className="w-full py-3 bg-white text-gray-600 border border-gray-200 rounded-xl font-semibold hover:bg-gray-50 flex items-center justify-center gap-2 transition-colors"
                        >
                            <IconTrash className="w-4 h-4" /> Reset Semua
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PhotoSession;
