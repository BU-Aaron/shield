<?php

namespace Modules\Notification\Controllers;

use GuzzleHttp\Psr7\Response;
use Modules\Common\Controllers\Controller;
use Modules\Notification\Actions\RetrieveNotificationAction;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class NotificationController extends Controller
{
    protected RetrieveNotificationAction $retrieveNotificationAction;

    public function __construct(RetrieveNotificationAction $retrieveNotificationAction)
    {
        $this->retrieveNotificationAction = $retrieveNotificationAction;
    }

    /**
     * Retrieve notifications for the logged-in user.
     */
    public function retrieveNotifications(): JsonResponse
    {
        $notifications = $this->retrieveNotificationAction->execute();

        return response()->json(['notifications' => $notifications], 200);
    }

    /**
     * Render the Notifications page with Inertia.
     */
    public function index(): InertiaResponse
    {
        $notifications = $this->retrieveNotificationAction->execute();

        return Inertia::render('Notifications', [
            'notifications' => $notifications,
        ]);
    }
}
