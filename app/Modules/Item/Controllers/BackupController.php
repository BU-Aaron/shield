<?php

namespace Modules\Item\Controllers;

use Illuminate\Http\JsonResponse;
use Modules\Item\Actions\BackupAllAction;
use Illuminate\Http\Response;
use Modules\Common\Controllers\Controller;

class BackupController extends Controller
{
    public function backupAll(): JsonResponse
    {
        try {
            $backupAction = app(BackupAllAction::class);
            $backupUrl = $backupAction->execute();

            return response()->json([
                'url' => $backupUrl,
                'message' => 'Backup created successfully.'
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Backup failed: ' . $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
