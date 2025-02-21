<?php

namespace Modules\Document\Data;

use Illuminate\Http\UploadedFile;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Attributes\Validation\Required;
use Spatie\LaravelData\Attributes\Validation\Uuid;

class UploadDocumentVersionData extends Data
{
    public function __construct(
        #[Uuid()]
        public string $document_item_id,

        #[Required]
        public UploadedFile $file,

        public ?string $due_date = null
    ) {}
}
