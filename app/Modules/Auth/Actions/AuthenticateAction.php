<?php

namespace Modules\Auth\Actions;

use Modules\Auth\Data\LoginData;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Validation\ValidationException;
use Illuminate\Auth\Events\Lockout;
use Illuminate\Support\Str;

class AuthenticateAction
{
    /**
     * Attempt to authenticate the user.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function execute(LoginData $data): void
    {
        $this->ensureIsNotRateLimited($data->username);

        if (! Auth::attempt(['username' => $data->username, 'password' => $data->password], $data->remember)) {
            RateLimiter::hit($this->throttleKey($data->username));

            throw ValidationException::withMessages([
                'username' => trans('auth.failed'),
            ]);
        }

        RateLimiter::clear($this->throttleKey($data->username));
    }

    /**
     * Ensure the login request is not rate limited.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    protected function ensureIsNotRateLimited(string $username): void
    {
        if (! RateLimiter::tooManyAttempts($this->throttleKey($username), 5)) {
            return;
        }

        event(new Lockout(request()));

        $seconds = RateLimiter::availableIn($this->throttleKey($username));

        throw ValidationException::withMessages([
            'username' => trans('auth.throttle', [
                'seconds' => $seconds,
                'minutes' => ceil($seconds / 60),
            ]),
        ]);
    }

    /**
     * Get the rate limiting throttle key for the request.
     */
    protected function throttleKey(string $username): string
    {
        return Str::transliterate(Str::lower($username) . '|' . request()->ip());
    }
}
