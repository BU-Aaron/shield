<?php

namespace App\Modules\ActivityLog\Helpers;

class ObjectTypeMapper
{
    /**
     * Maps the object type to the correct subject type.
     *
     * @param string|null $objectType
     * @return string|null
     */
    public static function mapToSubjectType(?string $objectType): ?string
    {
        if (empty($objectType)) {
            return null;
        }

        return match ($objectType) {
            'workspace' => 'Modules\Workspace\Models\Workspace',
            'folder' => 'Modules\Folder\Models\Folder',
            'document' => 'Modules\Document\Models\Document',
            'metadata' => 'Modules\Metadata\Models\Metadata',
            default => $objectType,
        };
    }
}
