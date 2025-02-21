<?php

namespace Modules\Document\Data;

use Spatie\LaravelData\Resource;
use Modules\Document\Models\Document;
use Modules\Folder\Models\Folder;

class DocumentResourceData extends Resource
{
    public function __construct(
        public string $item_id,
        public string $name,
        public ?string $document_number,
        public ?string $review_status,
        public ?string $approval_status,
        public ?string $description,
        public ?string $mime,
        public ?string $due_date,
        public ?string $file_path,
        public ?array $document_approval_ids,
        public array $related_documents,
        public array $metadata,
        public array $required_folder_metadata,
        public array $versions,
        public string $created_at,
        public string $updated_at,
        public ?string $archived_at
    ) {}

    /**
     * Create a DocumentResourceData instance from a Document model.
     *
     * @param Document $document
     * @param bool $includeSystemMetadata Whether to include system metadata
     * @return self
     */
    public static function fromModel(Document $document, bool $includeSystemMetadata = false): self
    {
        $requiredMetadata = Folder::find($document->item->parent_id);
        $requiredFolderMetadata = $requiredMetadata ? $requiredMetadata->requiredMetadata()->get()->map(fn($metadata) => [
            'metadata_id' => $metadata->id,
            'name' => $metadata->name,
        ])->toArray() : [];

        $currentVersion = $document->versions()->where('current', true)->first();

        $documentApprovalIds = $currentVersion ? $currentVersion->documentApprovals->map(fn($documentApproval) => [
            'id' => $documentApproval->id,
            'type' => $documentApproval->type,
        ])->toArray() : [];

        $metadataCollection = $document->metadata;
        if (!$includeSystemMetadata) {
            $metadataCollection = $metadataCollection->where('status', '!=', 'system')->values();
        }

        return new self(
            item_id: $document->item_id,
            name: $document->name,
            document_number: $document->document_number,
            review_status: $document->review_status?->label(),
            approval_status: $document->approval_status?->label(),
            description: $document->description,
            mime: $document->mime,
            due_date: $document->due_date,
            file_path: $document->file_path,
            document_approval_ids: $documentApprovalIds,
            related_documents: $document->relatedDocuments->map(fn($relatedDocument) => [
                'id' => $relatedDocument->id,
                'item_id' => $relatedDocument->item_id,
                'name' => $relatedDocument->name,
            ])->toArray(),
            metadata: $metadataCollection->map(fn($metadata) => [
                'metadata_id' => $metadata->id,
                'name' => $metadata->name,
                'value' => $metadata->pivot->value,
            ])->toArray(),
            required_folder_metadata: $requiredFolderMetadata,
            versions: $document->versions->map(fn($version) => [
                'id' => $version->id,
                'file_path' => $version->file_path,
                'uploaded_at' => $version->created_at->toDateTimeString(),
                'name' => $version->name,
                'mime' => $version->mime,
                'current' => $version->current,
                'review_status' => $version->review_status?->label(),
                'approval_status' => $version->approval_status?->label(),
            ])->toArray(),
            created_at: $document->created_at,
            updated_at: $document->updated_at,
            archived_at: $document->item->archived_at
        );
    }
}
