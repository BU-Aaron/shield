<?php

namespace Modules\Workspace\Data;

use Spatie\LaravelData\Data;
use Modules\Workspace\Models\Workspace;

class WorkspaceLinksData extends Data
{
    public function __construct(
        public string $item_id,
        public string $name,
        public string $url
    ) {}

    public static function fromModel(Workspace $workspace): self
    {
        $url = sprintf('/workspace/%s', $workspace->item_id);

        return new self(
            item_id: $workspace->item_id,
            name: $workspace->name,
            url: $url
        );
    }
}
