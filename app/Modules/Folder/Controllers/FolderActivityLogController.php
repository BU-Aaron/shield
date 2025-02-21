<?php

namespace Modules\Folder\Controllers;

use App\Modules\ActivityLog\Data\ActivityLogResourceData;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Modules\Common\Controllers\Controller;
use Modules\Folder\Models\Folder;
use Spatie\Activitylog\Models\Activity;

class FolderActivityLogController extends Controller
{
    public function index(Folder $folder, Request $request): Response
    {
        $search = $request->input('search');

        // $folder->activityLogs()->getQuery()->when;

        $activityLogs = $folder->activityLogs()->getQuery()
            ->when($search, function ($query, $search) {
                $searchableColumns = ['description'];

                $query->where(function ($query) use ($search, $searchableColumns) {
                    foreach ($searchableColumns as $column) {
                        $query->orWhere($column, 'like', "%{$search}%");
                    }
                });
            })
            ->orderBy('created_at', 'desc')
            ->paginate(10)
            ->withQueryString();



        return Inertia::render('FolderActivityLog', [
            'activityLogs' => ActivityLogResourceData::collect($activityLogs),
            'filters' => $request->only(['search']),
        ]);
    }
}
