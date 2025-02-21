<?php

use Illuminate\Support\Facades\Route;
use App\Modules\Item\Controllers\TrashController;

Route::middleware(['auth', 'verified'])->group(function () {

    Route::prefix('trash')->group(function () {

        Route::get('/', [TrashController::class, 'index'])->name('trash');

        Route::delete('/', [TrashController::class, 'delete'])->name('trash.delete');

        Route::post('/restore', [TrashController::class, 'restore'])->name('trash.restore');
    });
});
