<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;
use Modules\Item\Models\Item;
use Carbon\Carbon;
use App\Modules\Archive\Models\ArchiveFrequency;

class ArchiveCommand extends Command
{
    protected $signature = 'archive:items';

    protected $description = 'Automatically archive items based on their creation date';

    public function handle()
    {
        $this->info('Archiving process started.');

        // Retrieve the archive frequency
        $frequencyModel = ArchiveFrequency::first();
        if (!$frequencyModel) {
            $this->error('Archive frequency not set. Please configure it in Archive Options.');
            return;
        }

        // Check if automatic archiving is enabled
        if (!$frequencyModel->enabled) {
            $this->info('Automatic archiving is disabled.');
            return;
        }

        $years = $frequencyModel->years;

        $thresholdDate = Carbon::now()->subYears($years);
        $itemsToArchive = Item::whereNull('archived_at')
            ->whereDate('created_at', '<=', $thresholdDate)
            ->get();

        $totalArchived = 0;

        foreach ($itemsToArchive as $item) {
            $this->archiveWithChildren($item);
            $totalArchived++;
        }

        if ($totalArchived > 0) {
            $this->info("Archived {$totalArchived} items older than {$years} year(s).");
        } else {
            Log::info("No items were archived during this run.");
            $this->info("No items were archived.");
        }

        $this->info('Archiving process completed.');
    }

    private function archiveWithChildren(Item $item): void
    {
        // Fetch child items
        $children = Item::where('parent_id', $item->id)->get();

        // Recursively archive each child
        foreach ($children as $child) {
            $this->archiveWithChildren($child);
        }

        // Mark the item as archived by setting archived_at timestamp
        $item->archived_at = Carbon::now();
        $item->save();

        Log::info("Item archived: ID {$item->id}, Name: {$item->name}, Archived At: {$item->archived_at}, Uploaded At: {$item->created_at}");
    }
}
