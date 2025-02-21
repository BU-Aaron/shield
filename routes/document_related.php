<?php

use Illuminate\Support\Facades\Route;
use Modules\Document\Controllers\RelatedDocumentController;

Route::middleware(['auth', 'verified'])->group(function () {

    Route::prefix('documents/{document}/related/{relatedDocument}')->group(function () {

        Route::put('/', [RelatedDocumentController::class, 'attach']);

        Route::delete('/', [RelatedDocumentController::class, 'detach']);
    });
});
