import React, { useEffect } from "react";
import {
    Button,
    ActionIcon,
    Group,
    Select,
    Modal,
    Stack,
    Text,
    Flex,
    Loader,
    Alert,
} from "@mantine/core";
import { IconPlus, IconTrash, IconAlertCircle } from "@tabler/icons-react";
import useModalStore from "../../Hooks/use-modal-store";
import { useForm } from "@inertiajs/react";
import { notifications } from "@mantine/notifications";
import useFetchMetadata from "@/Modules/Metadata/Hooks/use-fetch-metadata";
import { useFetchExistingMetadataColumn } from "../../Hooks/use-fetch-existing-metadata-column";
import useFetchAllMetadata from "@/Modules/Metadata/Hooks/use-fetch-all-metadata";

interface SelectMetadataColumnFormProps {
    folderId: string;
}

const SelectMetadataColumnForm: React.FC<SelectMetadataColumnFormProps> = ({
    folderId,
}) => {
    const { modals, closeModal } = useModalStore();
    const isOpen = modals["selectMetadataColumns"];

    const { metadataList } = useFetchAllMetadata();

    const { existingMetadataColumns, loading, error } =
        useFetchExistingMetadataColumn({
            folderId,
            isOpen,
        });

    const { data, setData, post, processing, errors, reset } = useForm({
        metadata_columns: [{ id: Date.now(), value: "" }],
        metadata_ids: [] as number[],
    });

    // Populate metadata_columns with existing metadata when fetched
    useEffect(() => {
        if (existingMetadataColumns.length > 0) {
            const mappedColumns = existingMetadataColumns.map((column) => ({
                id: column.metadata_id,
                value: column.metadata_id.toString(),
            }));
            setData("metadata_columns", mappedColumns);
        }
    }, [existingMetadataColumns]);

    // Populate metadata_ids whenever metadata_columns changes
    useEffect(() => {
        const metadata_ids = data.metadata_columns
            .map((column) => parseInt(column.value))
            .filter((id) => !isNaN(id));
        setData("metadata_ids", metadata_ids);
    }, [data.metadata_columns]);

    const handleAddColumn = () => {
        setData("metadata_columns", [
            ...data.metadata_columns,
            { id: Date.now(), value: "" },
        ]);
    };

    const handleRemoveColumn = (id: number) => {
        setData(
            "metadata_columns",
            data.metadata_columns.filter((column) => column.id !== id)
        );
    };

    const handleChange = (id: number, value: string) => {
        const updatedColumns = data.metadata_columns.map((column) =>
            column.id === id ? { ...column, value } : column
        );
        setData("metadata_columns", updatedColumns);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const metadata_ids = data.metadata_columns
            .map((column) => parseInt(column.value))
            .filter((id) => !isNaN(id));

        post(route("folder.selectMetadataColumn", folderId), {
            preserveScroll: true,
            onSuccess: () => {
                closeModal("selectMetadataColumns");
                notifications.show({
                    position: "top-center",
                    title: "Success",
                    message: "Metadata columns selected successfully",
                    color: "green",
                });
                reset();
            },
            onError: () => {
                notifications.show({
                    position: "top-center",
                    title: "Error",
                    message: "Failed to select metadata columns",
                    color: "red",
                });
            },
        });
    };

    return (
        <Modal
            opened={isOpen}
            onClose={() => {
                closeModal("selectMetadataColumns");
                reset();
            }}
            title={
                <Text fw="bold" size="lg">
                    Select Tag Columns
                </Text>
            }
            size={550}
        >
            {loading ? (
                <Flex justify="center" align="center" h="100%">
                    <Loader />
                </Flex>
            ) : error ? (
                <Alert
                    icon={<IconAlertCircle size={16} />}
                    title="Error"
                    color="red"
                >
                    {error}
                </Alert>
            ) : (
                <form onSubmit={handleSubmit}>
                    <Stack gap={16}>
                        <Text c="dimmed">
                            Select the metadata columns you want to display
                        </Text>

                        {/* Render Select components only when metadataList is available */}
                        {data.metadata_columns.map((column) => (
                            <Group
                                key={column.id}
                                justify="space-between"
                                align="flex-end"
                            >
                                <Select
                                    placeholder="Pick a metadata column"
                                    data={metadataList.map((meta) => ({
                                        value: meta.metadata_id.toString(),
                                        label: meta.name,
                                    }))}
                                    value={column.value}
                                    onChange={(value) =>
                                        handleChange(column.id, value || "")
                                    }
                                    w="90%"
                                    required
                                />
                                {data.metadata_columns.length > 1 && (
                                    <ActionIcon
                                        color="red"
                                        variant="subtle"
                                        onClick={() =>
                                            handleRemoveColumn(column.id)
                                        }
                                    >
                                        <IconTrash size={18} />
                                    </ActionIcon>
                                )}
                            </Group>
                        ))}

                        {/* Add New Column Button */}
                        <Flex justify="flex-start">
                            <Button
                                variant="subtle"
                                color="blue.5"
                                leftSection={<IconPlus size={18} />}
                                onClick={handleAddColumn}
                            >
                                Add New Column
                            </Button>
                        </Flex>
                    </Stack>

                    {/* Modal Actions */}
                    <Flex align="center" justify="end" mt={16}>
                        <Button
                            variant="outline"
                            onClick={() => {
                                closeModal("selectMetadataColumns");
                                reset();
                            }}
                        >
                            Cancel
                        </Button>

                        <Button ml={12} type="submit" loading={processing}>
                            Save
                        </Button>
                    </Flex>
                </form>
            )}
        </Modal>
    );
};

export default SelectMetadataColumnForm;
