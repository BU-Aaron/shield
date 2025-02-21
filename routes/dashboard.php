<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Modules\Dashboard\Controllers\DashboardController;

Route::middleware(['auth', 'verified'])->group(function () {

    Route::prefix('dashboard')->group(function () {

        Route::get('/', [DashboardController::class, 'dashboard'])->name('dashboard');

        Route::get('/reports', [DashboardController::class, 'showDashboardReport'])->name('dashboard.reports');

        Route::post('/reports/select-metadata', [DashboardController::class, 'selectDashboardMetadataColumn'])->name('dashboard.selectMetadataColumn');
    });
});
