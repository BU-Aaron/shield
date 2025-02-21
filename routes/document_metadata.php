<?php

use Illuminate\Support\Facades\Route;
use Modules\Document\Controllers\DocumentMetadataController;

Route::middleware(['auth', 'verified'])->group(function () {

    Route::prefix('documents/{document}/metadata')->group(function () {

        Route::post('/', [DocumentMetadataController::class, 'attach']);

        Route::put('/{metadata}', [DocumentMetadataController::class, 'update']);

        Route::delete('/{metadata}', [DocumentMetadataController::class, 'detach']);
    });
});
