<?php

use Modules\Folder\Controllers\FolderController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {

    Route::prefix('folder')->group(function () {

        Route::get('/{folder}', [FolderController::class, 'show'])->name('folder.show');

        Route::post('/', [FolderController::class, 'store'])->name('folder.create');

        Route::get('/{folder}/edit', [FolderController::class, 'edit'])->name('folder.edit');

        Route::put('/{folder}', [FolderController::class, 'update'])->name('folder.update');

        Route::delete('/{folder}', [FolderController::class, 'destroy'])->name('folder.delete');

        Route::post('/{folder}/share', [FolderController::class, 'share'])->name('folder.share');

        Route::delete('/{folder}/share', [FolderController::class, 'removeShare'])->name('folder.removeShare');

        Route::post('/{folder}/required-metadata', [FolderController::class, 'updateFolderRequiredMetadata'])->name('folder.updateRequiredMetadata');

        Route::get('/{folder}/required-metadata', [FolderController::class, 'showFolderRequiredMetadata'])->name('folder.showRequiredMetadata');

        Route::get('/{folder}/metadata_columns', [FolderController::class, 'getExistingMetadataColumns'])->name('folder.getExistingMetadataColumns');

        Route::post('/{folder}/metadata_columns', [FolderController::class, 'selectMetadataColumn'])->name('folder.selectMetadataColumn');

        Route::delete('/{folder}/required_metadata/{metadata}', [FolderController::class, 'deleteRequiredMetadata'])->name('folder.deleteRequiredMetadata');

        Route::get('/{folder}/shared_users', [FolderController::class, 'fetchUserShareFolder'])->name('folder.fetchSharedUsers');
    });
});
