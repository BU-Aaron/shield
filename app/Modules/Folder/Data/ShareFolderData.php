<?php

namespace Modules\Folder\Data;

use Spatie\LaravelData\Data;
use Spatie\LaravelData\Attributes\Validation\Required;

class ShareFolderData extends Data
{
    /**
     * @var ShareFolderUserData[] $users
     */
    public function __construct(
        public array $users
    ) {}
}
