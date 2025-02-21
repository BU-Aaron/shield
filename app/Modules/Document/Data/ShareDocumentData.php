<?php

namespace Modules\Document\Data;

use Spatie\LaravelData\Data;
use Modules\Folder\Data\ShareFolderUserData;

class ShareDocumentData extends Data
{
    /**
     * @var ShareFolderUserData[] $users
     */
    public array $users;

    public function __construct(array $users)
    {
        $this->users = $users;
    }
}
