<?php

namespace Modules\Folder\Data;

use Spatie\LaravelData\Data;
use Spatie\LaravelData\Attributes\Validation\Required;
use Spatie\LaravelData\Attributes\Validation\Exists;

class RemoveShareFolderData extends Data
{
    public function __construct(
        #[Required, Exists('users', 'email')]
        public string $email,
    ) {}
}
