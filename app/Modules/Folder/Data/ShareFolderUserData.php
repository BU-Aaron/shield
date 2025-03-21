<?php

namespace Modules\Folder\Data;

use Spatie\LaravelData\Data;
use Spatie\LaravelData\Attributes\Validation\Required;
use Spatie\LaravelData\Attributes\Validation\Exists;
use Spatie\LaravelData\Attributes\Validation\In;

class ShareFolderUserData extends Data
{
    public function __construct(
        #[Required, Exists('users', 'email')]
        public string $email,

        #[Required, In(['viewer', 'editor'])]
        public string $role
    ) {}
}
