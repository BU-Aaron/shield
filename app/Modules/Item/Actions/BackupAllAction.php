<?php

namespace Modules\Item\Actions;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Modules\Item\Models\Item;
use ZipArchive;

class BackupAllAction
{
    public function execute(): string
    {
        // Define the path for the backup ZIP
        $zipPath = 'backups/' . now()->format('Y_m_d_H_i_s') . '_backup.zip';
        $publicPath = "public/$zipPath";

        // Ensure the backups directory exists
        if (!Storage::exists('backups')) {
            Storage::makeDirectory('public/backups');
        }

        $zipFile = Storage::path($publicPath);

        $zip = new ZipArchive();

        if ($zip->open($zipFile, ZipArchive::CREATE | ZipArchive::OVERWRITE) === true) {
            // Fetch root items (items without a parent)
            $rootItems = Item::with(['folder', 'document'])
                ->whereNull('parent_id')
                ->get();

            foreach ($rootItems as $item) {
                if ($item->folder) {
                    $this->addFolderToZip($zip, $item->folder);
                } elseif ($item->document) {
                    $this->addDocumentToZip($zip, $item->document);
                }
            }

            $zip->close();
        } else {
            Log::error("Failed to create backup zip file at $zipFile");
            throw new \Exception("Failed to create backup zip file.");
        }

        return Storage::url($zipPath);
    }

    private function addFolderToZip(ZipArchive $zip, $folder, $ancestors = '')
    {
        $folderPath = $ancestors . $folder->name . '/';

        // Iterate through child items
        $children = $folder->item->children()->with(['folder', 'document'])->get();

        foreach ($children as $child) {
            if ($child->folder) {
                $this->addFolderToZip($zip, $child->folder, $folderPath);
            } elseif ($child->document) {
                $this->addDocumentToZip($zip, $child->document, $folderPath);
            }
        }
    }

    private function addDocumentToZip(ZipArchive $zip, $document, $ancestors = '')
    {
        $publicPath = Storage::disk('public')->path($document->file_path);

        if (file_exists($publicPath)) {
            $zip->addFile($publicPath, $ancestors . $document->name);
        } else {
            Log::warning("File not found: $publicPath");
        }
    }
}
