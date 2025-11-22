<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\URL; // <--- TAMBAHKAN BARIS INI

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Cek: Hanya paksa HTTPS jika alamatnya BUKAN localhost
        if (!request()->is('http://127.0.0.1*') && !request()->is('http://localhost*')) {
            \Illuminate\Support\Facades\URL::forceScheme('https');
        }
        // Paksa gunakan HTTPS agar tidak blank di Ngrok
        if (config('app.env') !== 'local') {
            URL::forceScheme('https');
        }
        // Atau untuk testing sekarang, paksa saja langsung:
        URL::forceScheme('https'); // <--- TAMBAHKAN BARIS INI
    }
}