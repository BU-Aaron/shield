<?php

namespace Modules\DocumentApprovalHasUser\Data;

use Spatie\LaravelData\Resource;

class DocumentUserApprovalResourceData extends Resource
{
    public function __construct(
        public int $id,

        public int $user_id,

        public int $document_approval_id,

        public string $user_state,

        public string $comment,

        public string $created_at,

        public string $updated_at
    ) {}
}
