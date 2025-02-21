<?php

namespace Modules\Report\Actions;

use Modules\Report\Data\ReportParametersData;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Log;
use Modules\Item\Data\ItemContentsResourceData;
use Modules\Item\Data\ItemParentResourceData;
use Modules\Item\Models\Item;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class GenerateReportAction
{
    public function execute(ReportParametersData $data): array
    {
        $item = Item::find($data->folder_item_id);

        if (!$item) {
            return [
                'error' => 'Folder not found.',
            ];
        }

        $itemContents = $item->children()
            ->whereHas('document')
            ->with('document')
            ->get();

        $folder = ItemParentResourceData::fromModel($item);

        $headerPath = public_path() . '/images/report-header.png';
        $footerPath = public_path() . '/images/report-footer.png';

        $headerType = pathinfo($headerPath, PATHINFO_EXTENSION);
        $footerType = pathinfo($footerPath, PATHINFO_EXTENSION);

        $headerData = file_get_contents($headerPath);
        $footerData = file_get_contents($footerPath);

        $headerImage = 'data:image/' . $headerType . ';base64,' . base64_encode($headerData);
        $footerImage = 'data:image/' . $footerType . ';base64,' . base64_encode($footerData);

        $pdf = Pdf::loadView('report.folder_report', [
            'folder' => $folder,
            'items' => ItemContentsResourceData::collect($itemContents),
            'header' => $headerImage,
            'footer' => $footerImage,
        ])->setPaper('a4');

        // Generate a unique filename
        $filename = 'report_' . Str::random(10) . '.pdf';
        $path = 'reports/' . $filename;

        // Save the PDF to storage (e.g., public disk)
        Storage::disk('public')->put($path, $pdf->output());

        // Generate a URL to the stored PDF
        $url = Storage::url($path);

        return [
            'url' => $url,
            'filename' => $filename,
        ];
    }
}
