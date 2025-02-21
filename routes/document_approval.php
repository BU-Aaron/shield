<?php

use Illuminate\Support\Facades\Route;
use Modules\DocumentApproval\Controllers\DocumentApprovalController;

Route::middleware(['auth', 'verified'])->group(function () {

    Route::get('document_approval/pending', [DocumentApprovalController::class, 'getPendingApprovals'])->name('document_approvals.pending');

    Route::prefix('document_approval')->group(function () {

        Route::get('/{documentApproval}', [DocumentApprovalController::class, 'show'])->name('document_approvals.show');

        Route::get('/{documentApproval}/update', [DocumentApprovalController::class, 'showToUpdate'])->name('document_approvals.show_to_update');

        Route::post('/', [DocumentApprovalController::class, 'store'])->name('document_approvals.store');

        Route::put('/{documentApproval}', [DocumentApprovalController::class, 'update'])->name('document_approvals.update');

        Route::delete('/{documentApproval}', [DocumentApprovalController::class, 'cancel'])->name('document_approvals.cancel');
    });
});
