<?php

namespace Modules\Item\Actions;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Modules\Item\Data\DownloadItemsData;
use Modules\Item\Models\Item;
use Illuminate\Support\Str;
use ZipArchive;
use Illuminate\Support\Facades\Auth;

class DownloadItemsAction
{
    public function execute(DownloadItemsData $data)
    {
        $parent = $data->parent_id ? Item::find($data->parent_id) : null;

        $all = $data->all;
        $ids = $data->ids;

        if (!$all && empty($ids)) {
            return [
                'message' => 'Please select items to download'
            ];
        }

        $documentsToLog = [];

        if ($all) {
            if (!$parent) {
                return [
                    'message' => 'Parent item not found.'
                ];
            }

            $children = $parent->getChildren()->load('folder', 'document');
            $zipPath = $this->createZip($children);
            $filename = ($parent->folder->name ?? $parent->workspace->name) . '.zip';

            $documentsToLog = $children->whereNotNull('document')->pluck('document');
        } else {
            [$zipPath, $filename, $message, $downloadedDocuments] = $this->getDownloadUrl($ids, $parent ? ($parent->folder->name ?? $parent->workspace->name) : 'download');

            if ($message) {
                return [
                    'message' => $message
                ];
            }

            $documentsToLog = $downloadedDocuments;
        }

        foreach ($documentsToLog as $document) {
            activity()
                ->performedOn($document)
                ->causedBy(Auth::id())
                ->log("Document downloaded");
        }

        return $this->getDownloadResponse($zipPath, $filename);
    }

    public function createZip($items): string
    {
        // Generate a temporary file for the ZIP
        $zipPath = tempnam(sys_get_temp_dir(), 'zip');
        $zip = new ZipArchive();

        if ($zip->open($zipPath, ZipArchive::CREATE | ZipArchive::OVERWRITE) === true) {
            $this->addItemsToZip($zip, $items);
            $zip->close();
        } else {
            Log::error("Failed to create zip file at $zipPath");
            return '';
        }

        return $zipPath;
    }

    private function addItemsToZip($zip, $items, $ancestors = '')
    {
        foreach ($items as $item) {
            if ($item->folder) {
                $this->addItemsToZip($zip, $item->getChildren()->load('folder', 'document'), $ancestors . $item->folder->name . '/');
            } else {
                $document = $item->document;
                $filePath = Storage::disk('public')->path($document->file_path);

                if ($document->uploaded_on_cloud) {
                    try {
                        $content = Storage::get($document->file_path);
                    } catch (\Exception $e) {
                        Log::warning("Could not fetch file content: " . $e->getMessage());
                        continue;
                    }

                    $filePath = sys_get_temp_dir() . '/' . pathinfo($document->file_path, PATHINFO_BASENAME);
                    file_put_contents($filePath, $content);
                }

                if (file_exists($filePath)) {
                    $zip->addFile($filePath, $ancestors . $document->name);
                } else {
                    Log::warning("File not found: $filePath");
                }
            }
        }
    }

    private function getDownloadUrl(array $ids, $zipName)
    {
        $downloadedDocuments = [];

        if (count($ids) === 1) {
            $item = Item::find($ids[0]);
            if (!$item) {
                return [null, null, 'Item not found.', $downloadedDocuments];
            }

            if ($item->folder) {
                if ($item->getChildren()->load('folder', 'document')->count() === 0) {
                    return [null, null, 'The folder is empty.', $downloadedDocuments];
                }
                $children = $item->getChildren()->load('folder', 'document');
                $zipPath = $this->createZip($children);
                $filename = $item->folder->name . '.zip';

                $downloadedDocuments = $children->whereNotNull('document')->pluck('document');
            } elseif ($item->document) {
                $document = $item->document;
                $filePath = sys_get_temp_dir() . '/' . pathinfo($document->file_path, PATHINFO_BASENAME);

                try {
                    $content = $document->uploaded_on_cloud
                        ? Storage::get($document->file_path)
                        : Storage::disk('public')->get($document->file_path);

                    if (!$content) {
                        throw new \Exception('File content is null.');
                    }

                    file_put_contents($filePath, $content);
                } catch (\Exception $e) {
                    Log::error("Error fetching file content: " . $e->getMessage());
                    return [null, null, 'Error fetching file content.', $downloadedDocuments];
                }

                $zipPath = $filePath;
                $filename = $document->name;

                $downloadedDocuments[] = $document;
            } else {
                return [null, null, 'Selected item is neither a folder nor a document.', $downloadedDocuments];
            }
        } else {
            $items = Item::whereIn('id', $ids)->get();
            $zipPath = $this->createZip($items);
            $filename = $zipName . '.zip';

            $downloadedDocuments = $items->whereNotNull('document')->pluck('document');
        }

        return [$zipPath, $filename, null, $downloadedDocuments];
    }

    private function getDownloadResponse($zipPath, $filename)
    {
        return response()->download($zipPath, $filename)->deleteFileAfterSend(true);
    }
}
