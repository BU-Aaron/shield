<?php

use Modules\GlobalSearch\Controllers\GlobalSearchController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/search', [GlobalSearchController::class, 'search'])->name('search');
});
