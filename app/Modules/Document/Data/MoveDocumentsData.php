<?php

namespace App\Modules\Document\Data;

use Spatie\LaravelData\Attributes\Validation\Required;
use Spatie\LaravelData\Attributes\Validation\Uuid;
use Spatie\LaravelData\Data;

class MoveDocumentsData extends Data
{
    public function __construct(
        public array $ids,

        #[Required, Uuid]
        public string $destination_folder_id,
    ) {}
}
