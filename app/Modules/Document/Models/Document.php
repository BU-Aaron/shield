<?php

namespace Modules\Document\Models;

use Carbon\Carbon;
use Modules\Item\Models\Item;
use Modules\Metadata\Models\Metadata;
use Modules\User\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Modules\Document\States\DocumentState;
use Spatie\Activitylog\Models\Activity;
use Spatie\ModelStates\HasStates;

class Document extends Model
{
    use HasUuids, HasStates;

    protected $primaryKey = 'item_id'; // Use item_id as the primary key
    public $incrementing = false;

    protected $fillable = [
        'item_id',
        'name',
        'owned_by',
        'document_number',
        'review_status',
        'approval_status',
        'description',
        'due_date',
        'mime',
        'size',
        'file_path',
        'category',
    ];

    protected $casts = [
        'review_status' => DocumentState::class,
        'approval_status' => DocumentState::class,
    ];

    /**
     * Format the created_at attribute.
     */
    public function getCreatedAtAttribute($value)
    {
        return $value ? Carbon::parse($value)->format('Y-m-d h:i A') : null;
    }

    /**
     * Format the due_date attribute.
     */
    public function getDueDateAttribute($value)
    {
        return $value ? Carbon::parse($value)->format('Y-m-d h:i A') : null;
    }

    /**
     * Format the updated_at attribute.
     */
    public function getUpdatedAtAttribute($value)
    {
        return $value ? Carbon::parse($value)->format('Y-m-d h:i A') : null;
    }


    /**
     * Get the document's items.
     */
    public function item(): BelongsTo
    {
        return $this->belongsTo(Item::class);
    }

    /**
     * The metadata associated with the document.
     */
    public function metadata(): BelongsToMany
    {
        return $this->belongsToMany(Metadata::class, 'document_has_metadata', 'document_id', 'metadata_id')
            ->withPivot('value')
            ->withTimestamps();
    }

    /**
     * Get the related documents.
     */
    public function relatedDocuments(): BelongsToMany
    {
        return $this->belongsToMany(Document::class, 'related_documents', 'document_id', 'related_document_id')
            ->withTimestamps();
    }

    /**
     * Get the related to documents (for bidirectional relationship).
     */
    public function relatedToDocuments(): BelongsToMany
    {
        return $this->belongsToMany(Document::class, 'related_documents', 'related_document_id', 'document_id')
            ->withTimestamps();
    }

    public function userAccess(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'user_document_access', 'document_id', 'user_id')
            ->withPivot('role')
            ->withTimestamps();
    }

    public function activityLogs(): MorphMany
    {
        return $this->morphMany(Activity::class, 'subject');
    }

    /**
     * Get the document's versions.
     */
    public function versions(): HasMany
    {
        return $this->hasMany(DocumentHasVersion::class, 'document_item_id');
    }
}
