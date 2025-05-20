<?php

namespace Modules\Dashboard\Controllers;

use Modules\Dashboard\Data\DashboardMetadataResourceData;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use Modules\Common\Controllers\Controller;
use Modules\Dashboard\Actions\SelectDashboardReportMetadataColumnAction;
use Modules\Dashboard\Data\DashboardResource;
use Modules\Dashboard\Data\RecentlyUploadedDocumentResource;
use Modules\Dashboard\Data\SelectDashboardMetadataColumnData;
use Modules\Metadata\Models\Metadata;
use Modules\Document\Models\Document;
use Modules\Dashboard\Helpers\DocumentStatusHelper;
use Modules\Document\Data\DocumentResourceData;
use Modules\Item\Data\ItemContentsResourceData;
use Modules\Item\Models\Item;
use Modules\Dashboard\Authorization\DashboardAuthorization;
use Modules\User\Models\User;

class DashboardController extends Controller
{
    public function __construct(
        protected SelectDashboardReportMetadataColumnAction $selectDashboardReportMetadataColumnAction,
        protected DashboardAuthorization $dashboardAuthorization
    ) {}

    public function dashboard(): Response
    {
        // Enforce admin authorization
        $user = Auth::user();
        $user = User::find($user->id);
        $this->dashboardAuthorization->isAdmin($user);

        // Define document categories to count
        $categories = [
            'INV',              // will be used for the "INV" card
            'INQ',              // will be used for the "INQ" card
            'UI',               // will be used for the "UI" card
            'Forensic Reports', // will be used for the "Forensic Reports" card
            'Finance/Invest',   // will be used for the "Finance/Invest" card
            'Inventory Reports' // will be used for the "Inventory Reports" card
        ];

        $counts = [];
        foreach ($categories as $category) {
            $counts[$category] = Document::where('category', $category)
                ->whereHas('item', function ($query) use ($user) {
                    if (!$user->hasRole('admin') && !$user->hasRole('viewer')) {
                        $query->where(function ($q) use ($user) {
                            $q->whereHas('document.userAccess', function ($q2) use ($user) {
                                $q2->where('user_id', $user->id);
                            });
                        });
                    }
                })
                ->count();
        }

        // Count total documents
        $totalDocuments = Document::whereHas('item', function ($query) use ($user) {
            if (!$user->hasRole('admin') && !$user->hasRole('viewer')) {
                $query->where(function ($q) use ($user) {
                    $q->whereHas('document.userAccess', function ($q2) use ($user) {
                        $q2->where('user_id', $user->id);
                    });
                });
            }
        })->count();

        // Fetch recently uploaded documents, now using the category field only
        $recently_uploaded_documents = Document::whereHas('item', function ($query) use ($user) {
            if (!$user->hasRole('admin') && !$user->hasRole('viewer')) {
                $query->where(function ($q) use ($user) {
                    $q->whereHas('document.userAccess', function ($q2) use ($user) {
                        $q2->where('user_id', $user->id);
                    });
                });
            }
        })
            ->orderBy('updated_at', 'desc')
            ->take(5)
            ->get()
            ->map(function ($doc) {
                return new RecentlyUploadedDocumentResource(
                    id: $doc->item_id,
                    name: $doc->name,
                    category: $doc->category,
                    date_uploaded: $doc->updated_at,
                    mime: $doc->mime,
                    review_status: '',
                    approval_status: ''
                );
            })
            ->toArray();

        $dashboardData = new DashboardResource(
            number_of_inv: $counts['INV'],
            number_of_inq: $counts['INQ'],
            number_of_ui: $counts['UI'],
            number_of_documents: $totalDocuments,
            recently_uploaded_documents: $recently_uploaded_documents
        );

        // Fetch all users for the uploader filter
        $users = $user->hasRole('admin')
            ? User::select('id', 'name')->get()
            : collect([]);

        return Inertia::render('Dashboard', [
            'dashboard' => $dashboardData,
            'users' => $users,
        ]);
    }

    /**
     * Display the Dashboard Report page.
     *
     * @param Request $request
     * @return Response
     */
    public function showDashboardReport(Request $request)
    {
        $user = Auth::user();
        $user = User::find($user->id);
        $this->dashboardAuthorization->isAdmin($user);

        // Extract filters from query parameters
        $category = $request->query('category'); // category filter value (e.g. INV, INQ, etc.)
        $startDate = $request->query('start_date');
        $endDate = $request->query('end_date');
        $uploader = $request->query('uploader');
        $dueIn = $request->query('due_in');
        $metadataFilters = $request->query('metadata_filters', []);

        // Reconstruct metadataFilters if they are in a flat structure
        if ($this->isFlatMetadataFilters($metadataFilters)) {
            $metadataFilters = $this->groupMetadataFilters($metadataFilters);
        }

        // Get selected metadata columns from the dashboard_report_metadata_columns table
        $selectedMetadataIds = DB::table('dashboard_report_metadata_columns')->pluck('metadata_id')->toArray();
        $selectedMetadata = Metadata::whereIn('id', $selectedMetadataIds)->get();

        // Get all available metadata
        $availableMetadata = Metadata::all();

        // Get all users for the uploader filter
        $users = $user->hasRole('admin')
            ? User::select('id', 'name')->get()
            : collect([]);

        // Initialize the query (starting with all items that are not soft-deleted)
        $itemsQuery = Item::with('document.metadata')->whereNull('deleted_at');

        // For non-admin and non-viewer users, restrict document items by user access while still allowing folders.
        if (!$user->hasRole('admin') && !$user->hasRole('viewer')) {
            $itemsQuery->where(function ($q) use ($user) {
                $q->whereHas('document.userAccess', function ($q2) use ($user) {
                    $q2->where('user_id', $user->id);
                })
                    ->orWhere('type', 'folder');
            });
        }

        // Filter by category (apply to both document items and folders)
        if ($category) {
            $itemsQuery->where(function ($q) use ($category, $user) {
                $q->whereHas('document', function ($qDoc) use ($category, $user) {
                    $qDoc->where('category', $category);
                    if (!$user->hasRole('admin') && !$user->hasRole('viewer')) {
                        $qDoc->whereHas('userAccess', function ($q2) use ($user) {
                            $q2->where('user_id', $user->id);
                        });
                    }
                })
                    ->orWhere(function ($qFolder) use ($category) {
                        $qFolder->where('type', 'folder')
                            // Use the folder relationship to get the category
                            ->whereHas('folder', function ($q) use ($category) {
                                $q->where('category', $category);
                            });
                    });
            });
        }

        // Filter by uploader (apply to both documents and folders if applicable)
        if ($uploader) {
            $itemsQuery->where(function ($q) use ($uploader, $user) {
                $q->whereHas('document', function ($qDoc) use ($uploader, $user) {
                    $qDoc->where('owned_by', $uploader);
                    if (!$user->hasRole('admin') && !$user->hasRole('viewer')) {
                        $qDoc->whereHas('userAccess', function ($q2) use ($user) {
                            $q2->where('user_id', $user->id);
                        });
                    }
                })
                    ->orWhere(function ($qFolder) use ($uploader) {
                        $qFolder->where('type', 'folder')
                            ->where('owned_by', $uploader);
                    });
            });
        }

        // Filter by "due in" (check due_date of document items or folder items)
        if ($dueIn) {
            $dueDays = intval($dueIn);
            $currentDate = now();
            $itemsQuery->where(function ($q) use ($dueDays, $currentDate, $user) {
                $q->whereHas('document', function ($qDoc) use ($dueDays, $currentDate, $user) {
                    $qDoc->whereDate('due_date', '<=', $currentDate->copy()->addDays($dueDays));
                    if (!$user->hasRole('admin') && !$user->hasRole('viewer')) {
                        $qDoc->whereHas('userAccess', function ($q2) use ($user) {
                            $q2->where('user_id', $user->id);
                        });
                    }
                })
                    ->orWhere(function ($qFolder) use ($dueDays, $currentDate) {
                        $qFolder->where('type', 'folder')
                            ->whereDate('due_date', '<=', $currentDate->copy()->addDays($dueDays));
                    });
            });
        }

        // Filter by date range (using updated_at from documents or folders)
        if ($startDate && $endDate) {
            $itemsQuery->where(function ($q) use ($startDate, $endDate, $user) {
                $q->whereHas('document', function ($qDoc) use ($startDate, $endDate, $user) {
                    $qDoc->whereBetween('updated_at', [$startDate, $endDate]);
                    if (!$user->hasRole('admin') && !$user->hasRole('viewer')) {
                        $qDoc->whereHas('userAccess', function ($q2) use ($user) {
                            $q2->where('user_id', $user->id);
                        });
                    }
                })
                    ->orWhere(function ($qFolder) use ($startDate, $endDate) {
                        $qFolder->where('type', 'folder')
                            ->whereBetween('updated_at', [$startDate, $endDate]);
                    });
            });
        }

        // Apply metadata filters (only relevant for items that have a document relation)
        if (!empty($metadataFilters)) {
            foreach ($metadataFilters as $filter) {
                $field = $filter['field'] ?? null;
                $operator = $filter['operator'] ?? null;
                $value = $filter['value'] ?? null;

                if ($field && $operator && $value) {
                    $itemsQuery->whereHas('document.metadata', function ($query) use ($field, $operator, $value) {
                        switch ($operator) {
                            case 'includes':
                                $query->where('name', $field)
                                    ->where('value', 'LIKE', "%{$value}%");
                                break;
                            case 'excludes':
                                $query->where('name', $field)
                                    ->where('value', 'NOT LIKE', "%{$value}%");
                                break;
                            case 'is':
                                $query->where('name', $field)
                                    ->where('value', $value);
                                break;
                            case 'is_not':
                                $query->where('name', $field)
                                    ->where('value', '!=', $value);
                                break;
                            default:
                                // Handle unknown operator if necessary
                                break;
                        }
                    });
                }
            }
        }

        // Paginate the results
        $documents = $itemsQuery->paginate(15)->withQueryString();

        // Pass data to Inertia.
        // Note that we now pass the 'category' filter so the frontend (DashboardReport.tsx)
        // can initialize its state from filters.category.
        return Inertia::render('DashboardReport', [
            'documents' => ItemContentsResourceData::collect($documents),
            'filters' => [
                'category'         => $category,
                'start_date'       => $startDate,
                'end_date'         => $endDate,
                'uploader'         => $uploader,
                'due_in'           => $dueIn,
                'metadata_filters' => $metadataFilters,
            ],
            'selectedMetadata'   => DashboardMetadataResourceData::collect($selectedMetadata),
            'availableMetadata'  => DashboardMetadataResourceData::collect($availableMetadata),
            'existingMetadataIds' => $selectedMetadataIds,
            'users'              => $users,
        ]);
    }

    public function selectDashboardMetadataColumn(SelectDashboardMetadataColumnData $data)
    {
        $this->selectDashboardReportMetadataColumnAction->execute($data);

        return redirect()->back();
    }

    /**
     * Check if metadataFilters array is flat (i.e., each filter attribute is a separate array)
     *
     * @param array $metadataFilters
     * @return bool
     */
    private function isFlatMetadataFilters(array $metadataFilters): bool
    {
        return array_reduce($metadataFilters, function ($carry, $item) {
            return $carry && is_array($item) && count($item) === 1;
        }, true);
    }

    /**
     * Group flat metadataFilters into an array of filter objects.
     *
     * @param array $flatFilters
     * @return array
     */
    private function groupMetadataFilters(array $flatFilters): array
    {
        $groupedFilters = [];
        $currentFilter = [];

        foreach ($flatFilters as $item) {
            foreach ($item as $key => $value) {
                $currentFilter[$key] = $value;
                if (count($currentFilter) === 3) {
                    $groupedFilters[] = $currentFilter;
                    $currentFilter = [];
                }
            }
        }

        // Handle any incomplete filters if necessary
        if (!empty($currentFilter)) {
            // Optionally log or handle incomplete filters
        }

        return $groupedFilters;
    }
}
