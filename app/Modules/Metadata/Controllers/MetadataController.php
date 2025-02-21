<?php

namespace Modules\Metadata\Controllers;

use App\Modules\Metadata\Data\MetadataResourceData;
use Modules\Common\Controllers\Controller;
use Modules\Metadata\Models\Metadata;
use Modules\Metadata\Data\CreateMetadataData;
use Modules\Metadata\Data\UpdateMetadataData;
use Modules\Metadata\Actions\CreateMetadataAction;
use Modules\Metadata\Actions\UpdateMetadataAction;
use Modules\Metadata\Actions\DeleteMetadataAction;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Modules\Metadata\Authorization\MetadataAuthorization;
use Modules\Metadata\Models\MetadataHasPredefinedValue;

class MetadataController extends Controller
{
    protected MetadataAuthorization $metadataAuthorization;

    protected CreateMetadataAction $createMetadataAction;

    protected UpdateMetadataAction $updateMetadataAction;

    protected DeleteMetadataAction $deleteMetadataAction;

    public function __construct(
        CreateMetadataAction $createMetadataAction,
        UpdateMetadataAction $updateMetadataAction,
        DeleteMetadataAction $deleteMetadataAction,
        MetadataAuthorization $metadataAuthorization
    ) {
        $this->createMetadataAction = $createMetadataAction;
        $this->updateMetadataAction = $updateMetadataAction;
        $this->deleteMetadataAction = $deleteMetadataAction;
        $this->metadataAuthorization = $metadataAuthorization;
    }

    /**
     * Display a listing of the metadata.
     */
    public function index(Request $request)
    {
        // Authorize the user to view metadata
        $this->metadataAuthorization->canView($request->user());

        $search = $request->input('search');

        $metadata = Metadata::query()
            ->when($search, function ($query, $search) {
                $searchableColumns = ['name', 'type'];

                $query->where(function ($query) use ($search, $searchableColumns) {
                    foreach ($searchableColumns as $column) {
                        $query->orWhere($column, 'like', "%{$search}%");
                    }
                });
            })
            ->where('status', '!=', 'system') // Exclude system metadata
            ->orderBy('created_at', 'desc')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Metadata', [
            'metadata' => MetadataResourceData::collect($metadata),
            'filters' => $request->only(['search']),
        ]);
    }

    /**
     * Store a newly created metadata in storage.
     */
    public function store(CreateMetadataData $data): RedirectResponse
    {
        // Authorize the user to create metadata
        $this->metadataAuthorization->canCreate(Auth::user());

        $this->createMetadataAction->execute($data);

        return redirect()->back();
    }

    /**
     * Update the specified metadata in storage.
     */
    public function update(UpdateMetadataData $data, Metadata $metadata): RedirectResponse
    {
        // Authorize the user to update this metadata
        $this->metadataAuthorization->canUpdate(Auth::user(), $metadata);

        $this->updateMetadataAction->execute($metadata, $data);
        return redirect()->back();
    }

    /**
     * Remove the specified metadata from storage.
     */
    public function destroy(Metadata $metadata): RedirectResponse
    {
        // Authorize the user to delete this metadata
        $this->metadataAuthorization->canDelete(Auth::user(), $metadata);

        $this->deleteMetadataAction->execute($metadata);
        return redirect()->back();
    }

    /**
     * Fetch all available metadata.
     */
    public function fetchMetadata()
    {
        // Optional: Add authorization if needed
        $metadata = Metadata::where('status', '!=', 'system')->get();

        return response()->json([
            'metadata' => MetadataResourceData::collect($metadata),
        ]);
    }

    /**
     * Fetch all available metadata.
     */
    public function fetchAllMetadata()
    {
        // Optional: Add authorization if needed
        $metadata = Metadata::all();

        return response()->json([
            'metadata' => MetadataResourceData::collect($metadata),
        ]);
    }

    public function getPredefinedValues($id)
    {
        $metadata = Metadata::find($id);

        if (!$metadata) {
            return response()->json(['message' => 'Metadata not found.'], 404);
        }

        $predefinedValues = MetadataHasPredefinedValue::where('metadata_id', $id)->get(['id', 'predefined_value']);

        return response()->json(['predefined_values' => $predefinedValues], 200);
    }
}
