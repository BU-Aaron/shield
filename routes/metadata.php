<?php

use Modules\Metadata\Controllers\MetadataController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {

    Route::prefix('metadata')->group(function () {

        Route::get('/', [MetadataController::class, 'index'])->name('metadata.index');

        Route::post('/', [MetadataController::class, 'store'])->name('metadata.store');

        Route::patch('/{metadata}', [MetadataController::class, 'update'])->name('metadata.update');

        Route::delete('/{metadata}', [MetadataController::class, 'destroy'])->name('metadata.destroy');

        Route::get('/fetch', [MetadataController::class, 'fetchMetadata'])->name('metadata.fetch');

        Route::get('/fetch-all', [MetadataController::class, 'fetchAllMetadata'])->name('metadata.fetch-all');

        Route::get('/{metadata}/predefined-values', [MetadataController::class, 'getPredefinedValues'])->name('metadata.predefined-values');
    });
});
