<?php

use Illuminate\Support\Facades\Route;
use Modules\Item\Controllers\BackupController;
use Modules\Item\Controllers\ItemController;
use Modules\Item\Controllers\ShareController;

Route::middleware(['auth', 'verified'])->group(function () {

    Route::prefix('item')->group(function () {

        // Testing only. Temporary route to get all items
        Route::get('/', [ItemController::class, 'index']);

        Route::post('/archive', [ItemController::class, 'archive'])->name('item.archive');

        Route::get('/download', [ItemController::class, 'download'])->name('item.download');

        Route::delete('/', [ItemController::class, 'delete'])->name('item.delete');

        Route::get('/showItem/{item?}', [ItemController::class, 'showItems'])->name('item.showItems');

        Route::get('/shared-with-me', [ShareController::class, 'sharedWithMe'])->name('item.sharedWithMe');

        Route::get('/backup', [BackupController::class, 'backupAll'])->name('backup.all');
    });
});
