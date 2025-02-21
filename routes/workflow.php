<?php

use Modules\Workflow\Controllers\WorkflowController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {

    Route::prefix('workflows')->group(function () {

        Route::get('/', [WorkflowController::class, 'index'])->name('workflows.index');

        Route::get('/{workflow}', [WorkflowController::class, 'show'])->name('workflows.show');

        Route::post('/', [WorkflowController::class, 'store'])->name('workflows.store');

        Route::put('/{workflow}', [WorkflowController::class, 'update'])->name('workflows.update');

        Route::delete('/{workflow}', [WorkflowController::class, 'destroy'])->name('workflows.destroy');

        // Route::get('/api/users-by-workflow-type', [WorkflowController::class, 'getUsersByWorkflowType']);

        // Route::get('/get-workflow-users-by-type/{type}', [WorkflowController::class, 'getWorkflowUsersByType']);
    });
});
