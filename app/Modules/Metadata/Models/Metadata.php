<?php

namespace Modules\Metadata\Models;

use Modules\Document\Models\Document;
use Modules\Folder\Models\Folder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Metadata extends Model
{
    protected $fillable = [
        'name',
        'type',
        'status',
    ];

    /**
     * The documents that belong to the metadata.
     */
    public function documents(): BelongsToMany
    {
        return $this->belongsToMany(Document::class, 'document_has_metadata', 'metadata_id', 'document_id')
            ->withPivot('value')
            ->withTimestamps();
    }

    /**
     * The folders that belong to the metadata.
     */
    public function folders(): BelongsToMany
    {
        return $this->belongsToMany(Folder::class, 'folder_has_required_metadata', 'metadata_id', 'folder_item_id')
            ->withTimestamps();
    }

    /**
     * The folders that have metadata columns.
     */
    public function folderMetadataColumns(): BelongsToMany
    {
        return $this->belongsToMany(Folder::class, 'folder_has_metadata_columns', 'metadata_id', 'folder_item_id')
            ->withTimestamps();
    }

    /**
     * Get the predefined values for the metadata.
     */
    public function predefinedValues(): HasMany
    {
        return $this->hasMany(MetadataHasPredefinedValue::class, 'metadata_id');
    }
}
