<?php

namespace Modules\Auth\Data;

use Spatie\LaravelData\Data;

class LoginData extends Data
{
    public function __construct(
        public string $username,
        public string $password,
        public ?bool $remember = false,
    ) {}
}
