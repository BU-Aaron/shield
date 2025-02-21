<?php

namespace Modules\Document\Data;

use Illuminate\Http\UploadedFile;
use Illuminate\Validation\Rule;
use Spatie\LaravelData\Attributes\Validation\Mimes;
use Spatie\LaravelData\Attributes\Validation\MimeTypes;
use Spatie\LaravelData\Attributes\Validation\Required;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Attributes\Validation\Uuid;
use Spatie\LaravelData\Attributes\Validation\ArrayType;

class UploadDocumentData extends Data
{
    /**
     * @param FileData[] $files
     */
    public function __construct(
        #[Uuid()]
        public string $parent_id,

        #[Required]
        public array $files,

        #[Uuid()]
        public ?string $owned_by = null
    ) {}
}
