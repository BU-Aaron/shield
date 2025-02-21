<?php

namespace Modules\Workflow\Data;

use Modules\Workflow\Models\Workflow;
use Spatie\LaravelData\Resource;

class WorkflowResource extends Resource
{
    public function __construct(
        public int $id,

        public ?string $resolution = null,

        public string $type,

        public ?string $destination = null,

        public array $users
    ) {}

    public static function fromModel(Workflow $workflow): self
    {
        return new self(
            id: $workflow->id,
            resolution: $workflow->resolution,
            type: $workflow->type,
            destination: $workflow->destination,
            users: $workflow->users->map(fn($user) => [
                'id' => $user->id,
                'name' => $user->name,
                'role' => $user->workflow_role,
                'email' => $user->email,
            ])->toArray(),
        );
    }
}
