<?php

namespace Modules\Document\Data;

use Spatie\LaravelData\Data;
use Spatie\LaravelData\Attributes\Validation\Required;
use Spatie\LaravelData\Attributes\Validation\Exists;

class RemoveShareDocumentData extends Data
{
    public function __construct(
        #[Required, Exists('users', 'email')]
        public string $email,
    ) {}
}
