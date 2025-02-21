<?php

namespace Modules\Document\Actions;

use App\Modules\Document\Data\MoveDocumentsData;
use Modules\Document\Models\Document;
use Modules\Item\Models\Item;

class MoveDocumentsAction
{
    public function execute(MoveDocumentsData $data): void
    {
        Item::whereIn('id', $data->ids)->update(['parent_id' => $data->destination_folder_id]);
    }
}
