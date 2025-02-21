<?php

namespace Modules\Document\Actions;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Modules\Document\Data\UpdateDocumentData;
use Modules\Document\Models\Document;

class AttachDocumentMetadataAction
{
    public function execute(Document $document, UpdateDocumentData $data): void
    {
        $metadataData = collect($data->update_metadata)->map(function ($metadata) use ($document) {
            return [
                'document_id' => $document->item_id,
                'metadata_id' => $metadata->metadata_id,
                'value' => $metadata->value,
            ];
        })->toArray();

        // Use the DB facade to perform the upsert on the pivot table directly
        DB::table('document_has_metadata')->upsert(
            $metadataData,
            ['document_id', 'metadata_id'], // Unique constraint
            ['value'] // Columns to update
        );
    }
}


// namespace Modules\Document\Actions;

// use Modules\Document\Data\AttachDocumentMetadataData;
// use Modules\Document\Models\Document;

// class AttachDocumentMetadataAction
// {
//     public function execute(Document $document, AttachDocumentMetadataData $data): void
//     {
//         $document->metadata()->attach($data->metadata_id, ['value' => $data->value]);
//     }
// }
