<?php

namespace Modules\Document\Data;

use Spatie\LaravelData\Data;
use Illuminate\Http\UploadedFile;
use Spatie\LaravelData\Attributes\Validation\MimeTypes;
use Spatie\LaravelData\Attributes\Validation\Required;

class FileData extends Data
{
    public function __construct(
        #[Required, MimeTypes([
            'application/pdf',
            'application/msword',
            'application/xml',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'video/mp4',
            'video/mpeg',
            'video/ogg',
            'video/quicktime',
            'video/webm',
            'image/png',
            'image/jpeg',
        ])]
        public UploadedFile $file,
        public ?string $relativePath = '' // Added optional relativePath property
    ) {}

    public function getUploadedFile(): UploadedFile
    {
        return $this->file;
    }
}
