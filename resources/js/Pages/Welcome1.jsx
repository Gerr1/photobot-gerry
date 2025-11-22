import React from 'react';

const MaintenancePage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-800 p-6 font-sans">
      
      {/* Ikon besar (Menggunakan emoji, bisa diganti dengan SVG atau ikon library seperti FontAwesome) */}
      <div className="text-8xl mb-8 text-blue-600 animate-spin-slow">
        ⚙️ 
      </div>
      
      {/* Judul Utama */}
      <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
        Website Sedang dalam Pemeliharaan
      </h1>
      
      {/* Pesan Detail */}
      <p className="text-xl text-gray-600 max-w-2xl text-center mb-8">
        Kami sedang melakukan pembaruan dan pemeliharaan penting untuk menambah fitur dan design foto yang lebih banyak, mohon maaf atas pemeliharaan ini ya teman-teman😁
      </p>
      
      {/* Kartu Informasi Waktu */}
      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl border-t-4 border-blue-500 max-w-md w-full text-center">
        <p className="text-lg font-semibold text-blue-600 mb-2">
          Perkiraan Waktu Kembali Online:
        </p>
        <p className="text-2xl font-bold text-gray-900">
          Minggu, 23 November 2025
        </p>
        <p className="text-xl font-medium text-gray-700 mt-1">
          Pukul 14:00 WIB
        </p>
      </div>

      {/* Informasi Kontak/Update */}
      <div className="mt-8 text-sm text-gray-500">
        Untuk informasi lebih lanjut, silakan kunjungi 
        <a 
          href="[Link Media Sosial Anda]" 
          className="text-blue-500 hover:text-blue-700 font-medium ml-1 transition duration-150"
        >
          Media Sosial Kami
        </a>.
      </div>

    </div>
  );
};


export default MaintenancePage;
