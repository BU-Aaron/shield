<?php

namespace Modules\Folder\Models;

use Modules\Item\Models\Item;
use Modules\NumberingScheme\Models\NumberingScheme;
use Modules\User\Models\User;
use Modules\Workflow\Models\Workflow;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Spatie\Activitylog\Models\Activity;
use Modules\Metadata\Models\Metadata;

class Folder extends Model
{
    use HasUuids;

    protected $primaryKey = 'item_id'; // Use item_id as the primary key

    protected $fillable = [
        'name',
        'description',
        'owned_by',
        'parent_id', // Add parent_id to allow hierarchical folders
        'category',
    ];

    public function item(): BelongsTo
    {
        return $this->belongsTo(Item::class, 'item_id');
    }

    public function workflow(): HasOne
    {
        return $this->hasOne(Workflow::class);
    }

    public function numberingScheme(): HasOne
    {
        return $this->hasOne(NumberingScheme::class);
    }

    public function userAccess(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'user_folder_access', 'folder_id', 'user_id')
            ->withPivot('role')
            ->withTimestamps();
    }

    public function activityLogs(): MorphMany
    {
        return $this->morphMany(Activity::class, 'subject');
    }

    public function requiredMetadata(): BelongsToMany
    {
        return $this->belongsToMany(Metadata::class, 'folder_has_required_metadata', 'folder_item_id', 'metadata_id')
            ->withTimestamps();
    }

    public function metadataColumns(): BelongsToMany
    {
        return $this->belongsToMany(Metadata::class, 'folder_has_metadata_columns', 'folder_item_id', 'metadata_id')
            ->withTimestamps();
    }

    /**
     * Determine if the folder is a workspace.
     *
     * @return bool
     */
    public function isWorkspace(): bool
    {
        return is_null($this->parent_id);
    }
}
