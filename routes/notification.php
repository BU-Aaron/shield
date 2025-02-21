<?php

use Illuminate\Support\Facades\Route;
use Modules\Notification\Controllers\NotificationController;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::prefix('notifications')->group(function () {
        Route::get('/index', [NotificationController::class, 'index'])->name('notification.index');
        Route::get('/', [NotificationController::class, 'retrieveNotifications'])->name('notification.retrieveNotifications');
    });
});
