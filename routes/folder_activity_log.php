<?php

use Illuminate\Support\Facades\Route;
use Modules\Folder\Controllers\FolderActivityLogController;

Route::middleware(['auth', 'verified'])->group(function () {

    Route::prefix('folder')->group(function () {

        Route::get('/{folder}/activity-log', [FolderActivityLogController::class, 'index'])->name('folder.activity-log');
    });
});
