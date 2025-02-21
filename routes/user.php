<?php

use Modules\User\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {

    Route::prefix('users')->group(function () {

        Route::get('/', [UserController::class, 'index'])->name('users.index');


        Route::post('/register', [UserController::class, 'register'])->name('users.register');

        Route::put('/{user}', [UserController::class, 'update'])->name('users.update');

        Route::delete('/{user}', [UserController::class, 'delete'])->name('users.delete');

        Route::get('/get-users-approval-role/{type}', [UserController::class, 'getUsersApprovalRole'])->name('users.get-users-approval-role');

        Route::get('/get-users', [UserController::class, 'getUsers'])->name('users.get-users');
    });
});
