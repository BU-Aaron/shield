<?php

use App\Modules\ActivityLog\Controllers\ActivityLogController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {

    Route::prefix('activity-log')->group(function () {

        Route::get('/', [ActivityLogController::class, 'index'])->name('activity.log');
    });
});
