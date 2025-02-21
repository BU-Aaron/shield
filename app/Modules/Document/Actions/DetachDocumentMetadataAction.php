<?php

namespace Modules\Document\Actions;

use Modules\Document\Models\Document;
use Modules\Metadata\Models\Metadata;

class DetachDocumentMetadataAction
{
    public function execute(Document $document, Metadata $metadata): void
    {
        $document->metadata()->detach($metadata->id);
    }
}
