<?php

namespace Modules\DocumentApproval\Models;

use Modules\Document\Models\DocumentHasVersion;
use Modules\User\Models\User;
use Illuminate\Database\Eloquent\Model;
use Spatie\ModelStates\HasStates;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Modules\DocumentApproval\States\DocumentState;
use Modules\DocumentApprovalHasUser\Models\DocumentApprovalHasUser;
use Modules\Item\Models\Item;

class DocumentApproval extends Model
{
    use HasUuids, HasStates;

    protected $fillable = [
        'document_version_id',
        'resolution',
        'destination',
        'type',
        'overall_state',
    ];

    protected $casts = [
        'overall_state' => DocumentState::class,
    ];

    /**
     * Get the document version that owns the approval.
     */
    public function documentVersion()
    {
        return $this->belongsTo(DocumentHasVersion::class, 'document_version_id');
    }

    public function destinationItem()
    {
        return $this->belongsTo(Item::class, 'destination');
    }

    public function documentApprovalUsers()
    {
        return $this->hasMany(DocumentApprovalHasUser::class);
    }

    /**
     * Accessor to get the associated Document.
     */
    public function getDocumentAttribute()
    {
        return $this->documentVersion->document;
    }

    public function users()
    {
        return $this->belongsToMany(User::class, 'document_approval_has_users', 'document_approval_id', 'user_id');
    }
}
