<?php

namespace Modules\User\Data;

use Spatie\LaravelData\Data;

class UpdateUserData extends Data
{
    public function __construct(
        public ?string $workflow_role,
        public ?string $office_position,
        public ?string $system_role,
    ) {}
}
