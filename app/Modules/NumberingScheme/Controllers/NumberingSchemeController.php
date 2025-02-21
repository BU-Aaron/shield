<?php

namespace Modules\NumberingScheme\Controllers;

use Modules\Common\Controllers\Controller;
use Modules\NumberingScheme\Actions\CreateNumberingSchemeAction;
use Modules\NumberingScheme\Actions\DeleteNumberingSchemeAction;
use Modules\NumberingScheme\Actions\UpdateNumberingSchemeAction;
use Modules\NumberingScheme\Data\CreateNumberingSchemeData;
use Modules\NumberingScheme\Data\NumberingSchemeResourceData;
use Modules\NumberingScheme\Data\UpdateNumberingSchemeData;
use Modules\NumberingScheme\Models\NumberingScheme;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Modules\NumberingScheme\Authorization\NumberingSchemeAuthorization;

class NumberingSchemeController extends Controller
{
    protected NumberingSchemeAuthorization $numberingSchemeAuthorization;

    protected CreateNumberingSchemeAction $createNumberingSchemeAction;

    protected UpdateNumberingSchemeAction $updateNumberingSchemeAction;

    protected DeleteNumberingSchemeAction $deleteNumberingSchemeAction;

    public function __construct(
        CreateNumberingSchemeAction $createNumberingSchemeAction,
        UpdateNumberingSchemeAction $updateNumberingSchemeAction,
        DeleteNumberingSchemeAction $deleteNumberingSchemeAction,
        NumberingSchemeAuthorization $numberingSchemeAuthorization
    ) {
        $this->createNumberingSchemeAction = $createNumberingSchemeAction;
        $this->updateNumberingSchemeAction = $updateNumberingSchemeAction;
        $this->deleteNumberingSchemeAction = $deleteNumberingSchemeAction;
        $this->numberingSchemeAuthorization = $numberingSchemeAuthorization;
    }

    /**
     * Display a listing of the numbering schemes.
     */
    public function index(Request $request)
    {
        // Authorize the user to view numbering schemes
        $this->numberingSchemeAuthorization->canView($request->user());

        $search = $request->input('search');

        $numberingSchemes = NumberingScheme::query()
            ->when($search, function ($query, $search) {
                $searchableColumns = ['name'];

                $query->where(function ($query) use ($search, $searchableColumns) {
                    foreach ($searchableColumns as $column) {
                        $query->orWhere($column, 'like', "%{$search}%");
                    }
                });
            })
            ->orderBy('created_at', 'desc')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('NumberingScheme', [
            'numberingSchemes' => NumberingSchemeResourceData::collect($numberingSchemes),
            'filters' => $request->only(['search']),
        ]);
    }

    /**
     * Show the form for creating a new numbering scheme.
     */
    public function store(CreateNumberingSchemeData $data): RedirectResponse
    {
        // Authorize the user to create a numbering scheme
        $this->numberingSchemeAuthorization->canCreate(Auth::user());

        $this->createNumberingSchemeAction->execute($data);

        return redirect()->back();
    }

    /**
     * Update the specified numbering scheme in storage.
     */
    public function update(UpdateNumberingSchemeData $data, NumberingScheme $numberingScheme): RedirectResponse
    {
        // Authorize the user to update this numbering scheme
        $this->numberingSchemeAuthorization->canUpdate(Auth::user(), $numberingScheme);

        $this->updateNumberingSchemeAction->execute($numberingScheme, $data);

        return redirect()->back();
    }

    /**
     * Remove the specified numbering scheme from storage.
     */
    public function destroy(NumberingScheme $numberingScheme): RedirectResponse
    {
        // Authorize the user to delete this numbering scheme
        $this->numberingSchemeAuthorization->canDelete(Auth::user(), $numberingScheme);

        $this->deleteNumberingSchemeAction->execute($numberingScheme);

        return redirect()->back();
    }

    /**
     * Fetch the numbering scheme of a folder.
     */
    public function getNumberingSchemeOfFolder(NumberingScheme $numberingScheme): JsonResponse
    {
        // Optional: Add authorization if needed
        return response()->json($numberingScheme);
    }
}
