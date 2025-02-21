import React, { useEffect } from "react";
import { Modal, Button, Group, Stack, Text, Checkbox } from "@mantine/core";
import { useForm } from "@inertiajs/react";
import useModalStore from "@/Modules/Common/Hooks/use-modal-store";
import useFetchMetadata from "@/Modules/Metadata/Hooks/use-fetch-metadata";
import { useFetchExistingMetadataColumn } from "@/Modules/Common/Hooks/use-fetch-existing-metadata-column";
import { MetadataResourceData } from "@/Modules/Metadata/Types/MetadataResourceData";
import { notifications } from "@mantine/notifications";

interface SelectMetadataColumnFormProps {
    folderId: string;
}

const SelectMetadataColumnForm: React.FC<SelectMetadataColumnFormProps> = ({
    folderId,
}) => {
    const { modals, closeModal } = useModalStore();
    const isOpen = modals["selectMetadataColumns"];
    const { metadataList } = useFetchMetadata();
    const { existingMetadataColumns, loading, error } =
        useFetchExistingMetadataColumn({ folderId, isOpen });

    const { data, setData, post, processing, errors } = useForm({
        metadata_ids: [] as number[],
    });

    useEffect(() => {
        const existingIds = existingMetadataColumns.map(
            (meta) => meta.metadata_id
        );
        setData("metadata_ids", existingIds);
    }, [isOpen, existingMetadataColumns]);

    const handleCheckboxChange = (metadataId: number) => {
        const current = data.metadata_ids;
        if (current.includes(metadataId)) {
            setData(
                "metadata_ids",
                current.filter((id) => id !== metadataId)
            );
        } else {
            setData("metadata_ids", [...current, metadataId]);
        }
    };

    const handleSubmit = () => {
        post(route("folder.selectMetadataColumn", folderId), {
            onSuccess: () => {
                closeModal("selectMetadataColumns");
                notifications.show({
                    position: "top-center",
                    title: "Success",
                    message: "Metadata columns selected successfully",
                });
            },
            onError: (error) => {
                console.error(error);
                notifications.show({
                    position: "top-center",
                    title: "Error",
                    message: "Failed to select metadata columns",
                });
            },
        });
    };

    return (
        <Modal
            opened={isOpen}
            onClose={() => closeModal("selectMetadataColumns")}
            title="Select Columns"
        >
            <Stack>
                <Text>Select the metadata columns you want to display:</Text>
                {loading ? (
                    <Text>Loading...</Text>
                ) : error ? (
                    <Text c="red">{error}</Text>
                ) : (
                    <Group dir="column">
                        <Checkbox label="Name" checked disabled />
                        <Checkbox label="Date" checked disabled />

                        {metadataList.map((meta) => (
                            <Checkbox
                                key={meta.metadata_id}
                                label={meta.name}
                                checked={data.metadata_ids.includes(
                                    meta.metadata_id
                                )}
                                onChange={() =>
                                    handleCheckboxChange(meta.metadata_id)
                                }
                            />
                        ))}
                    </Group>
                )}
                {errors.metadata_ids && (
                    <Text c="red">{errors.metadata_ids}</Text>
                )}
                <Group justify="flex-end" mt="md">
                    <Button
                        variant="outline"
                        onClick={() => closeModal("selectMetadataColumns")}
                    >
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} loading={processing}>
                        Save
                    </Button>
                </Group>
            </Stack>
        </Modal>
    );
};

export default SelectMetadataColumnForm;
