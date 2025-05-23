<?php

use Modules\Auth\Controllers\AuthenticatedSessionController;
use Modules\Auth\Controllers\ConfirmablePasswordController;
use Modules\Auth\Controllers\EmailVerificationNotificationController;
use Modules\Auth\Controllers\EmailVerificationPromptController;
use Modules\Auth\Controllers\NewPasswordController;
use Modules\Auth\Controllers\PasswordController;
use Modules\Auth\Controllers\PasswordResetLinkController;
use Modules\Auth\Controllers\RegisteredUserController;
use Modules\Auth\Controllers\VerifyEmailController;
use Illuminate\Support\Facades\Route;
use Modules\Auth\Controllers\ForgotPasswordSecurityController;

Route::middleware('guest')->group(function () {
    // Route::get('register', [RegisteredUserController::class, 'create'])
    //     ->name('register');

    // Route::post('register', [RegisteredUserController::class, 'store']);

    Route::get('login', [AuthenticatedSessionController::class, 'create'])
        ->name('login');

    Route::post('login', [AuthenticatedSessionController::class, 'store']);

    Route::get('forgot-password', [PasswordResetLinkController::class, 'create'])
        ->name('password.request');

    Route::post('forgot-password', [PasswordResetLinkController::class, 'store'])
        ->name('password.email');

    Route::get('reset-password/{token}', [NewPasswordController::class, 'create'])
        ->name('password.reset');

    Route::post('reset-password', [NewPasswordController::class, 'store'])
        ->name('password.store');

    Route::get('forgot-password-username', [ForgotPasswordSecurityController::class, 'showUsernameForm'])
        ->name('password.username');

    Route::post('forgot-password-username', [ForgotPasswordSecurityController::class, 'processUsername']);

    Route::get('security-question', [ForgotPasswordSecurityController::class, 'showSecurityQuestionForm'])
        ->name('security.question');

    Route::post('security-question', [ForgotPasswordSecurityController::class, 'processSecurityAnswer']);

    Route::get('reset-password-manual', [ForgotPasswordSecurityController::class, 'showResetPasswordForm'])
        ->name('password.manual');

    Route::post('reset-password-manual', [ForgotPasswordSecurityController::class, 'updatePassword']);
});

Route::middleware('auth')->group(function () {
    Route::get('verify-email', EmailVerificationPromptController::class)
        ->name('verification.notice');

    Route::get('verify-email/{id}/{hash}', VerifyEmailController::class)
        ->middleware(['signed', 'throttle:6,1'])
        ->name('verification.verify');

    Route::post('email/verification-notification', [EmailVerificationNotificationController::class, 'store'])
        ->middleware('throttle:6,1')
        ->name('verification.send');

    Route::get('confirm-password', [ConfirmablePasswordController::class, 'show'])
        ->name('password.confirm');

    Route::post('confirm-password', [ConfirmablePasswordController::class, 'store']);

    Route::put('password', [PasswordController::class, 'update'])->name('password.update');

    Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])
        ->name('logout');
});
