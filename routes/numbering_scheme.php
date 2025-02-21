<?php

use Modules\NumberingScheme\Controllers\NumberingSchemeController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {

    Route::prefix('numbering-scheme')->group(function () {

        Route::get('/', [NumberingSchemeController::class, 'index'])->name('numbering-scheme.index');

        Route::get('/{numberingScheme}', [NumberingSchemeController::class, 'show'])->name('numbering-scheme.show');

        Route::post('/create', [NumberingSchemeController::class, 'store'])->name('numbering-scheme.store');

        Route::put('/{numberingScheme}', [NumberingSchemeController::class, 'update'])->name('numbering-scheme.update');

        Route::delete('/{numberingScheme}', [NumberingSchemeController::class, 'destroy'])->name('numbering-scheme.destroy');

        // Route::get('/api/{numberingScheme}', [NumberingSchemeController::class, 'getNumberingSchemeOfFolder']);
    });
});
