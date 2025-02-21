<?php

namespace App\Modules\ActivityLog\Controllers;

use Inertia\Inertia;
use Spatie\Activitylog\Models\Activity;
use Modules\Common\Controllers\Controller;
use App\Modules\ActivityLog\Data\ActivityLogResourceData;
use App\Modules\ActivityLog\Helpers\ObjectTypeMapper;
use Illuminate\Http\Request;
use Inertia\Response;
use Modules\User\Models\User;
use App\Modules\ActivityLog\Authorization\ActivityLogAuthorization;

class ActivityLogController extends Controller
{
    protected ActivityLogAuthorization $activityLogAuthorization;

    public function __construct(ActivityLogAuthorization $activityLogAuthorization)
    {
        $this->activityLogAuthorization = $activityLogAuthorization;
    }

    public function index(Request $request): Response
    {
        // Authorize the user
        $this->activityLogAuthorization->canView($request->user());

        $search = $request->input('search');
        $userId = $request->input('user_id');
        $objectType = $request->input('object_type', '');
        $startDate = $request->input('start_date');
        $endDate = $request->input('end_date');

        $mappedObjectType = ObjectTypeMapper::mapToSubjectType($objectType);

        $activityLogs = Activity::query()
            ->when($search, function ($query, $search) {
                $searchableColumns = ['description'];

                $query->where(function ($query) use ($search, $searchableColumns) {
                    foreach ($searchableColumns as $column) {
                        $query->orWhere($column, 'like', "%{$search}%");
                    }
                });
            })
            ->when($userId, function ($query, $userId) {
                $query->where('causer_id', $userId);
            })
            ->when($mappedObjectType, function ($query, $mappedObjectType) {
                $query->where('subject_type', $mappedObjectType);
            })
            ->when($startDate && $endDate, function ($query) use ($startDate, $endDate) {
                $query->whereBetween('created_at', [$startDate, $endDate]);
            })
            ->orderBy('created_at', 'desc')
            ->paginate(10)
            ->withQueryString();

        $users = User::all(['id', 'name']);
        $objectTypes = Activity::distinct()->pluck('subject_type')->map(function ($type) {
            return [
                'value' => $type,
                'label' => ucfirst(strtolower(class_basename($type))),
            ];
        });

        return Inertia::render('ActivityLog', [
            'activityLogs' => ActivityLogResourceData::collect($activityLogs),
            'filters' => $request->only(['search', 'user_id', 'object_type', 'start_date', 'end_date']),
            'users' => $users,
            'objectTypes' => $objectTypes,
        ]);
    }
}
