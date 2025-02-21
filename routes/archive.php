<?php

use Modules\Folder\Controllers\FolderController;
use Illuminate\Support\Facades\Route;
use Modules\Archive\Controllers\ArchiveController;

Route::middleware(['auth', 'verified'])->group(function () {

    Route::prefix('archive')->group(function () {

        Route::get('/{folder?}', [ArchiveController::class, 'show'])->name('archive.show');

        Route::post('/unarchive', [ArchiveController::class, 'unarchive'])->name('archive.unarchive');
    });
});
