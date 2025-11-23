import React, { useState, useRef, useCallback } from "react";
import Webcam from "react-webcam";
import { Head, Link } from "@inertiajs/react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function PhotoSession({ layoutId, userName }) {
    const webcamRef = useRef(null);
    const collageRef = useRef(null);

    const [images, setImages] = useState([]);
    const [isFinished, setIsFinished] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    // TIMER STATE
    const [timer, setTimer] = useState(0);
    const [countdown, setCountdown] = useState(0);

    // --- CONFIG TEMA
    const getThemeConfig = (id) => {
        const numId = parseInt(id);
        const configs = {
            1: {
                name: "Sakura",
                bg: "bg-pink-100",
                frame: "border-pink-300",
                text: "text-pink-600",
                emoji: "🌸",
                titleFont: "font-serif",
            },
            2: {
                name: "Halloween",
                bg: "bg-orange-950",
                frame: "border-orange-600",
                text: "text-orange-500",
                emoji: "🎃",
                titleFont: "font-mono",
            },
            3: {
                name: "Ocean",
                bg: "bg-cyan-100",
                frame: "border-cyan-500",
                text: "text-cyan-700",
                emoji: "🌊",
                titleFont: "font-sans",
            },
            4: {
                name: "Vintage",
                bg: "bg-[#fdf6e3]",
                frame: "border-[#8b5e3c]",
                text: "text-[#8b5e3c]",
                emoji: "🎞️",
                titleFont: "font-serif",
            },
            5: {
                name: "Cyberpunk",
                bg: "bg-slate-900",
                frame: "border-cyan-400",
                text: "text-cyan-400",
                emoji: "🤖",
                titleFont: "font-mono",
            },
            6: {
                name: "Christmas",
                bg: "bg-red-50",
                frame: "border-green-600",
                text: "text-red-600",
                emoji: "🎄",
                titleFont: "font-serif",
            },
            7: {
                name: "Love",
                bg: "bg-rose-100",
                frame: "border-red-400",
                text: "text-red-500",
                emoji: "❤️",
                titleFont: "font-serif",
            },
            8: {
                name: "Galaxy",
                bg: "bg-[#1a1a2e]",
                frame: "border-purple-500",
                text: "text-purple-300",
                emoji: "✨",
                titleFont: "font-mono",
            },
            9: {
                name: "Newspaper",
                bg: "bg-gray-100",
                frame: "border-black",
                text: "text-black",
                emoji: "📰",
                titleFont: "font-serif",
            },
            10: {
                name: "Rainbow",
                bg: "bg-yellow-50",
                frame: "border-purple-400",
                text: "text-purple-600",
                emoji: "🌈",
                titleFont: "font-sans",
            },
        };
        return (
            configs[numId] || {
                name: "Classic",
                bg: "bg-white",
                frame: "border-gray-800",
                text: "text-gray-800",
                emoji: "📸",
                titleFont: "font-sans",
            }
        );
    };

    const theme = getThemeConfig(layoutId);

    const videoConstraints = { width: 720, height: 720, facingMode: "user" };

    // CAPTURE + TIMER
    const capture = useCallback(() => {
        if (timer > 0) {
            setCountdown(timer);
            let current = timer;

            const interval = setInterval(() => {
                current -= 1;
                setCountdown(current);

                if (current === 0) {
                    clearInterval(interval);
                    setCountdown(0);

                    const imageSrc = webcamRef.current.getScreenshot();
                    if (images.length < 6) setImages([...images, imageSrc]);
                }
            }, 1000);
        } else {
            const imageSrc = webcamRef.current.getScreenshot();
            if (images.length < 6) setImages([...images, imageSrc]);
        }
    }, [webcamRef, images, timer]);

    // DOWNLOAD HASIL
    const downloadResult = async (format) => {
        if (!collageRef.current) return;
        setIsProcessing(true);
        try {
            const canvas = await html2canvas(collageRef.current, {
                scale: 2,
                useCORS: true,
                backgroundColor: null,
            });

            const fileName = `${theme.name}_${userName}_${Date.now()}`;

            if (format === "pdf") {
                const imgData = canvas.toDataURL("image/png");
                const pdf = new jsPDF("p", "mm", "a4");
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
                pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
                pdf.save(`${fileName}.pdf`);
            } else {
                const link = document.createElement("a");
                link.download = `${fileName}.${format}`;
                link.href = canvas.toDataURL(
                    `image/${format}`,
                    format === "jpeg" ? 0.9 : 1.0
                );
                link.click();
            }
        } catch (error) {
            console.error(error);
            alert("Gagal download :(");
        }
        setIsProcessing(false);
    };

    // GRID
    const getGridClass = () => {
        const id = parseInt(layoutId);
        if (id % 4 === 0) return "grid-cols-2 gap-4 p-8";
        if (id % 4 === 1) return "grid-cols-3 gap-2 p-4";
        if (id % 4 === 2) return "grid-cols-3 gap-y-4 gap-x-1 p-2";
        return "grid-cols-2 gap-1 p-2";
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center py-6">
            <Head title={`Sesi Foto ${theme.name}`} />

            <div className="w-full max-w-5xl flex justify-between items-center px-4 mb-4">
                <Link
                    href="/dashboard"
                    data={{ name: userName }}
                    className="text-gray-400 hover:text-white transition"
                >
                    ← Ganti Tema
                </Link>
                <div className="text-right">
                    <p className="text-sm text-gray-400">Model</p>
                    <h2 className="text-xl font-bold text-pink-500">
                        {userName}
                    </h2>
                </div>
            </div>

            <div className="w-full max-w-6xl flex flex-col md:flex-row gap-8 px-4 justify-center items-start">
                {/* CAMERA AREA */}
                {!isFinished && (
                    <div className="flex-1 flex flex-col items-center w-full">
                        <div className="relative rounded-3xl overflow-hidden shadow-[0_0_30px_rgba(236,72,153,0.3)] border-4 border-slate-700 w-full max-w-md bg-black aspect-square">
                            {/* WEBCAM */}
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
                                    <p className="text-xl font-bold">
                                        Foto Lengkap!
                                    </p>
                                    <p className="text-sm text-gray-400">
                                        Siap untuk dicetak?
                                    </p>
                                </div>
                            )}

                            {/* COUNTDOWN */}
                            {countdown > 0 && (
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-7xl font-bold">
                                    {countdown}
                                </div>
                            )}
                        </div>

                        {/* TIMER BUTTON */}
                        <div className="flex gap-3 mt-4">
                            {[3, 5, 10].map((t) => (
                                <button
                                    key={t}
                                    onClick={() => setTimer(t)}
                                    className={`px-4 py-2 rounded-lg border ${
                                        timer === t
                                            ? "bg-pink-500 text-white"
                                            : "bg-slate-800 text-gray-300"
                                    }`}
                                >
                                    {t}s
                                </button>
                            ))}
                            <button
                                onClick={() => setTimer(0)}
                                className={`px-4 py-2 rounded-lg border ${
                                    timer === 0
                                        ? "bg-green-500 text-white"
                                        : "bg-slate-800 text-gray-300"
                                }`}
                            >
                                No Timer
                            </button>
                        </div>

                        {/* CAPTURE BUTTON */}
                        <div className="mt-6 flex items-center gap-6">
                            {images.length < 6 ? (
                                <button
                                    onClick={capture}
                                    className="w-20 h-20 rounded-full bg-white border-[6px] border-gray-300 hover:border-pink-500 hover:scale-110 transition-all duration-200 shadow-xl"
                                ></button>
                            ) : (
                                <button
                                    onClick={() => setIsFinished(true)}
                                    className="px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold rounded-full shadow-lg text-lg animate-bounce"
                                >
                                    Lihat Hasil Akhir ✨
                                </button>
                            )}
                        </div>
                        <p className="mt-4 text-slate-500 font-medium">
                            {images.length}/6 Foto Terambil
                        </p>
                    </div>
                )}

                {/* RESULT */}
                <div
                    className={`${
                        isFinished
                            ? "w-full max-w-3xl"
                            : "hidden md:block w-1/3"
                    }`}
                >
                    <div
                        ref={collageRef}
                        className={`relative shadow-2xl overflow-hidden transition-all duration-500 ${theme.bg}`}
                        style={{ minHeight: "600px" }}
                    >
                        <div className="absolute top-2 left-2 text-4xl opacity-80 z-10">
                            {theme.emoji}
                        </div>
                        <div className="absolute top-2 right-2 text-4xl opacity-80 z-10 transform scale-x-[-1]">
                            {theme.emoji}
                        </div>
                        <div className="absolute bottom-2 left-2 text-4xl opacity-80 z-10">
                            {theme.emoji}
                        </div>
                        <div className="absolute bottom-2 right-2 text-4xl opacity-80 z-10 transform scale-x-[-1]">
                            {theme.emoji}
                        </div>

                        <div className="text-center py-6 relative z-10">
                            <h1
                                className={`text-4xl font-bold tracking-wider uppercase ${theme.text} ${theme.titleFont}`}
                            >
                                {theme.name} Memories
                            </h1>
                            <p
                                className={`text-sm opacity-70 mt-1 font-semibold tracking-widest ${theme.text}`}
                            >
                                PHOTOBOT X {userName.toUpperCase()}
                            </p>
                        </div>

                        <div className={`grid ${getGridClass()} relative z-10`}>
                            {[...Array(6)].map((_, index) => (
                                <div
                                    key={index}
                                    className={`relative aspect-square overflow-hidden border-4 ${theme.frame} bg-white/50 backdrop-blur-sm shadow-sm`}
                                >
                                    {images[index] ? (
                                        <>
                                            <img
                                                src={images[index]}
                                                className="w-full h-full object-cover filter contrast-110"
                                            />
                                            {!isFinished && (
                                                <button
                                                    onClick={() => {
                                                        const newImages = [
                                                            ...images,
                                                        ];
                                                        newImages.splice(
                                                            index,
                                                            1
                                                        );
                                                        setImages(newImages);
                                                    }}
                                                    className="absolute inset-0 bg-red-500/60 opacity-0 hover:opacity-100 flex items-center justify-center text-white font-bold text-2xl"
                                                >
                                                    Ulangi
                                                </button>
                                            )}
                                        </>
                                    ) : (
                                        <div
                                            className={`w-full h-full flex items-center justify-center text-4xl opacity-30 ${theme.text}`}
                                        >
                                            {index + 1}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="pb-4 pt-4 text-center">
                            <div
                                className={`text-[10px] font-mono opacity-60 ${theme.text}`}
                            >
                                {new Date().toLocaleDateString()} •{" "}
                                {new Date().toLocaleTimeString()} • #{layoutId}
                            </div>
                        </div>
                    </div>

                    {isFinished && (
                        <div className="mt-8 bg-slate-800 p-6 rounded-2xl border border-slate-700 text-center animate-fade-in-up">
                            <h3 className="text-white text-lg mb-4 font-medium">
                                Simpan kenangan indah ini:
                            </h3>

                            {isProcessing ? (
                                <div className="text-pink-400 animate-pulse font-bold">
                                    Sedang mencetak... Tunggu sebentar 🖨️
                                </div>
                            ) : (
                                <div className="flex flex-wrap justify-center gap-4">
                                    <button
                                        onClick={() => downloadResult("jpeg")}
                                        className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold shadow-lg"
                                    >
                                        JPG (HP)
                                    </button>
                                    <button
                                        onClick={() => downloadResult("png")}
                                        className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold shadow-lg"
                                    >
                                        PNG (HD)
                                    </button>
                                    <button
                                        onClick={() => downloadResult("pdf")}
                                        className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold shadow-lg"
                                    >
                                        PDF (Dokumen)
                                    </button>
                                    <button
                                        onClick={() => {
                                            setImages([]);
                                            setIsFinished(false);
                                        }}
                                        className="px-6 py-3 bg-gray-600 hover:bg-gray-500 text-white rounded-xl font-bold shadow-lg"
                                    >
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
