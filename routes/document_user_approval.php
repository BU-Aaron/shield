<?php

use Illuminate\Support\Facades\Route;
use Modules\DocumentApprovalHasUser\Controllers\DocumentUserApprovalController;

Route::middleware(['auth', 'verified'])->group(function () {

    Route::prefix('user_approval/{userApproval}')->group(function () {

        Route::post('/accept', [DocumentUserApprovalController::class, 'accept'])
            ->name('document_user_approval.accept');

        Route::post('/reject', [DocumentUserApprovalController::class, 'reject'])
            ->name('document_user_approval.reject');
    });
});
