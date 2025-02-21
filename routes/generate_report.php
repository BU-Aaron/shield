<?php

use Illuminate\Support\Facades\Route;
use Modules\Report\Controllers\GenerateReportController;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::post('/generate-report', [GenerateReportController::class, 'generate'])->name('report.generate');

    Route::post('/generate-dashboard-report', [GenerateReportController::class, 'generateDashboardReport'])->name('report.generateDashboard');
});
