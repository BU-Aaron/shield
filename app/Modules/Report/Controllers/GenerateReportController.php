<?php

namespace Modules\Report\Controllers;

use Modules\Common\Controllers\Controller;
use Modules\Report\Actions\GenerateReportAction;
use Modules\Report\Data\ReportParametersData;
use Illuminate\Http\Request;
use Modules\Dashboard\Data\DashboardReportParametersData;
use Modules\Report\Actions\GenerateDashboardReportAction;

class GenerateReportController extends Controller
{
    public function __construct(
        protected GenerateReportAction $generateReportAction,
        protected GenerateDashboardReportAction $generateDashboardReportAction
    ) {}

    public function generate(ReportParametersData $data)
    {
        $result = $this->generateReportAction->execute($data);

        if (isset($result['error'])) {
            return response()->json(['error' => $result['error']], 404);
        }

        return response()->json([
            'url' => $result['url'],
            'filename' => $result['filename'],
        ]);
    }

    public function generateDashboardReport(DashboardReportParametersData $data)
    {
        $result = $this->generateDashboardReportAction->execute($data);

        if (isset($result['error'])) {
            return response()->json(['error' => $result['error']], 404);
        }

        return response()->json([
            'url' => $result['url'],
            'filename' => $result['filename'],
        ]);
    }
}
