<?php

namespace App\Modules\Admin\Controllers;

use Inertia\Inertia;
use Inertia\Response;
use Modules\Common\Controllers\Controller;
use App\Modules\Admin\Authorization\AdminAuthorization;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AdminController extends Controller
{
    protected AdminAuthorization $adminAuthorization;

    public function __construct(AdminAuthorization $adminAuthorization)
    {
        $this->adminAuthorization = $adminAuthorization;
    }

    /**
     * Display the Admin Tools page.
     *
     * @param  Request  $request
     * @return Response
     */
    public function index(Request $request): Response
    {
        // Authorize the user
        $this->adminAuthorization->canAccessAdminTools(Auth::user());

        // You can fetch any additional data here if needed

        return Inertia::render('AdminTools', [
            // Pass any required data to the view
        ]);
    }
}
