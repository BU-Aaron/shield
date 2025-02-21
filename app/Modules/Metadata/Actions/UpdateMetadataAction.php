<?php

namespace Modules\Metadata\Actions;

use Modules\Metadata\Data\UpdateMetadataData;
use Modules\Metadata\Models\Metadata;

class UpdateMetadataAction
{
    public function execute(Metadata $metadata, UpdateMetadataData $data): Metadata
    {
        $metadata->update($data->toArray());

        if (is_array($data->predefined_values)) {
            // Sync predefined values
            $metadata->predefinedValues()->delete(); // Remove existing
            foreach ($data->predefined_values as $value) {
                // Ensure $value is an array with 'predefined_value' key
                if (is_array($value) && isset($value['predefined_value'])) {
                    $metadata->predefinedValues()->create([
                        'predefined_value' => $value['predefined_value'],
                    ]);
                } elseif (is_string($value)) {
                    // If $value is a string, use it directly
                    $metadata->predefinedValues()->create([
                        'predefined_value' => $value,
                    ]);
                } else {
                    // Handle unexpected structure
                    // You can log this or throw an exception based on your requirements
                    // Example:
                    // throw new \InvalidArgumentException("Invalid predefined value structure.");
                }
            }
        }

        return $metadata;
    }
}
