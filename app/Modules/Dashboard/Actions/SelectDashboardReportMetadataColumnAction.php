<?php

namespace Modules\Dashboard\Actions;

use Illuminate\Support\Facades\DB;
use Modules\Dashboard\Data\SelectDashboardMetadataColumnData;

class SelectDashboardReportMetadataColumnAction
{
    /**
     * Execute the action to select metadata columns for the dashboard report.
     *
     * @param SelectDashboardMetadataColumnData $data
     * @return void
     */
    public function execute(SelectDashboardMetadataColumnData $data): void
    {
        // Sync the metadata columns for the dashboard report
        DB::table('dashboard_report_metadata_columns')->delete();

        $insertData = array_map(function ($metadataId) {
            return [
                'metadata_id' => $metadataId,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }, $data->metadata_ids);

        DB::table('dashboard_report_metadata_columns')->insert($insertData);
    }
}
