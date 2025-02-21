<?php

namespace Modules\GlobalSearch\Controllers;

use Modules\Common\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Modules\Document\Models\Document;
use Modules\Folder\Models\Folder;
use Modules\Metadata\Models\Metadata;

class GlobalSearchController extends Controller
{
    /**
     * Handle the search request.
     *
     * @param Request $request
     * @return \Inertia\Response
     */
    public function search(Request $request)
    {
        $query = $request->input('query');

        // Search Documents
        $documents = Document::query()
            ->where('name', 'like', "%{$query}%")
            ->orWhere('document_number', 'like', "%{$query}%")
            ->orWhereHas('metadata', function ($q) use ($query) {
                $q->where('value', 'like', "%{$query}%");
            })
            ->get();

        return Inertia::render('SearchItemsResult', [
            'documents' => $documents->map(function ($doc) {

                return [
                    'id' => $doc->item_id,
                    'name' => $doc->name,
                    'document_number' => $doc->document_number,
                    'mime' => $doc->mime,
                    'type' => $doc->type,
                    'status' => $doc->status ? $doc->status->label() : null,
                    'missing_required_metadata' => $doc->missing_required_metadata,
                    'metadata' => $doc->metadata->map(fn($metadata) => [
                        'metadata_id' => $metadata->id,
                        'name' => $metadata->name,
                        'value' => $metadata->pivot->value,
                    ])->toArray(),
                ];
            }),
            'query' => $query,
        ]);
    }
}
