<?php

use App\Modules\Archive\Controllers\ArchiveFrequencyController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/get-years', [ArchiveFrequencyController::class, 'getYears'])->name('archive.frequency.getYears');
    Route::put('/update-years', [ArchiveFrequencyController::class, 'updateYears'])->name('archive.frequency.updateYears');
});
