<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Http\Request; // <--- PENTING: Wajib ada agar input nama berfungsi

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

// 1. Halaman Depan (Input Nama)
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// 2. Dashboard (Pilihan Tema)
// Catatan: Saya menghapus middleware 'auth' agar user bisa masuk tanpa login (Guest)
Route::get('/dashboard', function (Request $request) {
    return Inertia::render('Dashboard', [
        'userName' => $request->query('name', 'Pengunjung') // Default 'Pengunjung' jika kosong
    ]);
})->name('dashboard');

// 3. Sesi Foto (Kamera)
Route::get('/photo-session/{layoutId}', function ($layoutId, Request $request) {
    return Inertia::render('PhotoSession', [
        'layoutId' => $layoutId,
        'userName' => $request->query('name', 'Pengunjung')
    ]);
})->name('photo.session');

// 4. Route Profile (Bawaan Breeze - Biarkan saja jika nanti butuh fitur login admin)
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';