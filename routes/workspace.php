<?php

use Modules\Workspace\Controllers\WorkspaceController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {

    Route::prefix('workspace')->group(function () {

        Route::get('/', [WorkspaceController::class, 'index'])->name('workspace.index');

        Route::get('/{workspace}', [WorkspaceController::class, 'show'])->name('workspace.show');

        Route::post('/', [WorkspaceController::class, 'store'])->name('workspace.store');

        Route::post('/{workspace}/share', [WorkspaceController::class, 'share'])->name('workspace.share');

        Route::delete('/{workspace}/share', [WorkspaceController::class, 'removeShare'])->name('workspace.removeShare');
    });
});
