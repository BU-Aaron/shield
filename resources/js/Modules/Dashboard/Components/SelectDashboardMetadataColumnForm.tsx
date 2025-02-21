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
import useModalStore from "@/Modules/Common/Hooks/use-modal-store";
import { useForm } from "@inertiajs/react";
import { notifications } from "@mantine/notifications";
import useFetchMetadata from "@/Modules/Metadata/Hooks/use-fetch-metadata";
import { useFetchExistingMetadataColumn } from "@/Modules/Common/Hooks/use-fetch-existing-metadata-column";
import { DashboardMetadataResourceData } from "../Types/DashboardMetadataResourceData";

interface SelectDashboardMetadataColumnFormProps {
    availableMetadata: DashboardMetadataResourceData[];
    existingMetadataIds: number[];
}

const SelectDashboardMetadataColumnForm: React.FC<
    SelectDashboardMetadataColumnFormProps
> = ({ availableMetadata, existingMetadataIds }) => {
    const { modals, closeModal } = useModalStore();
    const isOpen = modals["selectDashboardMetadataColumns"];

    const { existingMetadataColumns, loading, error } =
        useFetchExistingMetadataColumn({
            folderId: "", // Adjust if necessary
            isOpen,
        });

    const { data, setData, post, processing, errors, reset } = useForm({
        metadata_columns: [{ id: Date.now(), value: "" }],
        metadata_ids: [] as number[],
    });

    // Populate metadata_columns with existing metadata when fetched
    useEffect(() => {
        if (existingMetadataIds.length > 0) {
            const mappedColumns = existingMetadataIds.map((id) => ({
                id: Date.now() + id, // Ensure unique ID
                value: id.toString(),
            }));
            setData("metadata_columns", mappedColumns);
        }
    }, [existingMetadataIds, isOpen]);

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

        post(route("dashboard.selectMetadataColumn"), {
            preserveScroll: true,
            onSuccess: () => {
                closeModal("selectDashboardMetadataColumns");
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
                closeModal("selectDashboardMetadataColumns");
                reset();
            }}
            title="Select Metadata Columns"
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
                        <Text>
                            Select the metadata columns you want to display in
                            the dashboard report:
                        </Text>

                        {/* Render Select components dynamically */}
                        {data.metadata_columns.map((column) => (
                            <Group
                                key={column.id}
                                justify="space-between"
                                align="flex-end"
                            >
                                <Select
                                    placeholder="Pick a metadata column"
                                    data={availableMetadata.map((meta) => ({
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
                                closeModal("selectDashboardMetadataColumns");
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

export default SelectDashboardMetadataColumnForm;
