<?php

namespace Modules\Workspace\Data;

use Spatie\LaravelData\Data;

class CreateWorkspaceData extends Data
{
    public function __construct(
        public string $name,
        public ?string $owned_by = null
    ) {}
}
