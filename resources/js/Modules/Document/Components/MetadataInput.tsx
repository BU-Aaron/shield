import React, { useMemo, useState } from "react";
import {
    Group,
    ActionIcon,
    TextInput,
    Button,
    Stack,
    Text,
    Alert,
    Select,
    Loader,
    Autocomplete,
} from "@mantine/core";
import { IconPlus, IconTrash, IconAlertCircle } from "@tabler/icons-react";
import { DocumentMetadata } from "../Types/DocumentMetadata";
import useModalStore from "@/Modules/Common/Hooks/use-modal-store";
import AddDocumentMetadataModal from "./AddDocumentMetadataModal";
import { FolderRequiredMetadataResource } from "@/Modules/Folder/Types/FolderRequiredMetadataResource";
import useFetchMetadataPredefinedValue from "@/Modules/Document/Hooks/use-fetch-metadata-predefined-value";

interface MetadataInputProps {
    metadata: DocumentMetadata[];
    requiredMetadata: FolderRequiredMetadataResource[];
    onAdd?: (metadata: DocumentMetadata) => void;
    onUpdate?: (metadata: DocumentMetadata[]) => void;
    onChange?: (metadata: DocumentMetadata[]) => void;
    onDelete?: (metadataId: number) => void;
}

const MetadataInput: React.FC<MetadataInputProps> = ({
    metadata,
    requiredMetadata,
    onAdd,
    onUpdate,
    onChange,
    onDelete,
}) => {
    const { openModal } = useModalStore();
    const [activeMetadataId, setActiveMetadataId] = useState<number | null>(
        null
    );

    const handleAddMetadata = (newMetadata: DocumentMetadata) => {
        onAdd && onAdd(newMetadata);
    };

    const handleAddCustomMetadata = () => {
        openModal("addDocumentMetadata");
    };

    const handleRemove = (index: number) => {
        const removedMeta = metadata[index];
        const newMetadata = metadata.filter((_, i) => i !== index);
        onUpdate && onUpdate(newMetadata);
        onDelete &&
            removedMeta.metadata_id !== 0 &&
            onDelete(removedMeta.metadata_id);
    };

    const handleChange = (
        index: number,
        field: keyof DocumentMetadata,
        value: string
    ) => {
        const newMetadata = metadata.map((item, i) =>
            i === index ? { ...item, [field]: value } : item
        );
        onChange && onChange(newMetadata);
    };

    // Compute missing required metadata
    const missingRequiredMetadata = useMemo(() => {
        const existingIds = metadata.map((meta) => meta.metadata_id);
        return requiredMetadata.filter(
            (required) => !existingIds.includes(required.metadata_id)
        );
    }, [metadata, requiredMetadata]);

    return (
        <Stack>
            {metadata.map((meta, index) => (
                <Group
                    key={meta.metadata_id || index}
                    justify="space-between"
                    align="flex-end"
                >
                    <TextInput
                        disabled
                        label="Name"
                        placeholder="Metadata name"
                        value={meta.name}
                        onChange={(e) =>
                            handleChange(index, "name", e.target.value)
                        }
                    />
                    <PredefinedValueSelect
                        metadataId={meta.metadata_id}
                        value={meta.value || ""}
                        onChange={(value) =>
                            handleChange(index, "value", value)
                        }
                    />
                    <ActionIcon
                        color="red"
                        variant="subtle"
                        size="lg"
                        onClick={() => handleRemove(index)}
                    >
                        <IconTrash size={16} />
                    </ActionIcon>
                </Group>
            ))}

            {/* Display warnings for missing required metadata */}
            {missingRequiredMetadata.length > 0 && (
                <Stack gap="xs">
                    {missingRequiredMetadata.map((required) => (
                        <Alert
                            icon={<IconAlertCircle size={16} />}
                            title={`${required.name} is missing`}
                            color="orange"
                            variant="light"
                            key={required.metadata_id}
                        />
                    ))}
                </Stack>
            )}

            <Button
                variant="light"
                onClick={handleAddCustomMetadata}
                leftSection={<IconPlus size={14} />}
            >
                Add New Tag
            </Button>
            <AddDocumentMetadataModal
                onAdd={(meta) =>
                    handleAddMetadata({
                        metadata_id: meta.metadata_id,
                        name: meta.name,
                        value: "",
                    })
                }
            />
        </Stack>
    );
};

interface PredefinedValueSelectProps {
    metadataId: number;
    value: string;
    onChange: (value: string) => void;
}

const PredefinedValueSelect: React.FC<PredefinedValueSelectProps> = ({
    metadataId,
    value,
    onChange,
}) => {
    const { predefinedValues, loading, error } =
        useFetchMetadataPredefinedValue(metadataId);

    if (loading) {
        return <Loader size="sm" />;
    }

    if (error) {
        return (
            <Text c="red" size="sm">
                {error}
            </Text>
        );
    }

    return (
        <Autocomplete
            label="Value"
            data={predefinedValues.map((pre) => ({
                value: pre.predefined_value,
                label: pre.predefined_value,
            }))}
            value={value}
            onChange={(val) => onChange(val || "")}
        />
    );
};

export default MetadataInput;
