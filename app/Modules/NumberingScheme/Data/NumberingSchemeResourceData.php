<?php

namespace Modules\NumberingScheme\Data;

use Modules\NumberingScheme\Models\NumberingScheme;
use Spatie\LaravelData\Resource;

class NumberingSchemeResourceData extends Resource
{
    public function __construct(
        public int $id,
        public string $prefix,
        public string $name,
        public string $folder_name,
        public int $next_number,
        public string $reset_frequency
    ) {}

    public static function fromModel(NumberingScheme $numberingScheme): self
    {
        return new self(
            id: $numberingScheme->id,
            prefix: $numberingScheme->prefix,
            name: $numberingScheme->name,
            folder_name: $numberingScheme->folder->name ?? 'No Folder',
            next_number: $numberingScheme->next_number,
            reset_frequency: $numberingScheme->reset_frequency
        );
    }
}
