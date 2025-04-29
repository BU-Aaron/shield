<?php

namespace Modules\User\Data;

use Spatie\LaravelData\Data;
use Spatie\LaravelData\Attributes\Validation\Confirmed;
use Spatie\LaravelData\Attributes\Validation\Email;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Required;
use Spatie\LaravelData\Attributes\Validation\Unique;
use Spatie\LaravelData\Attributes\Validation\Password;

class RegisterUserData extends Data
{
    public function __construct(
        #[Required, Max(255)]
        public string $name,

        #[Required, Email, Max(255), Unique('users', 'email')]
        public string $email,

        #[Required, Max(255)]
        public string $username,

        public ?string $office_position,

        public ?string $workflow_role,

        #[Required, Max(255)]
        public string $system_role,
    ) {}
}
