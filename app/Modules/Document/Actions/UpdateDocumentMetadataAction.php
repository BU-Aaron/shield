<?php

// namespace Modules\Document\Actions;

// use Modules\Document\Data\UpdateDocumentMetadataData;
// use Modules\Document\Models\Document;
// use Modules\Metadata\Models\Metadata;

// class UpdateDocumentMetadataAction
// {
//     public function execute(Document $document, Metadata $metadata, UpdateDocumentMetadataData $data): void
//     {
//         $document->metadata()->updateExistingPivot($metadata->id, ['value' => $data->value]);
//     }
// }

namespace Modules\Document\Actions;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Modules\Document\Data\UpdateDocumentData;
use Modules\Document\Models\Document;
use Modules\Metadata\Models\Metadata;

class UpdateDocumentMetadataAction
{
    public function execute(Document $document, UpdateDocumentData $data): void
    {
        // Causing error so commenting it out
        // $metadata = Metadata::where('name', 'Due In')->first();

        // $document->metadata()->syncWithoutDetaching([$metadata->id => [
        //     'value' => $data->due_date,
        // ]]);

        $metadataData = collect($data->update_metadata)->map(function ($metadata) use ($document) {
            return [
                'document_id' => $document->item_id,
                'metadata_id' => $metadata->metadata_id,
                'value' => $metadata->value,
            ];
        })->toArray();

        DB::table('document_has_metadata')->upsert(
            $metadataData,
            ['document_id', 'metadata_id'],
            ['value']
        );

        // Fetch the updated metadata for verification
        $updatedMetadata = DB::table('document_has_metadata')
            ->where('document_id', $document->item_id)
            ->get();

        if (!empty($data->delete_metadata)) {
            $metadataIdsToDelete = collect($data->delete_metadata)->pluck('metadata_id')->toArray();

            DB::table('document_has_metadata')
                ->where('document_id', $document->item_id)
                ->whereIn('metadata_id', $metadataIdsToDelete)
                ->delete();
        }
    }
}
