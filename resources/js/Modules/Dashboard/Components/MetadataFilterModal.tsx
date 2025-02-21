import React, { useState } from "react";
import {
    Modal,
    Button,
    Group,
    Select,
    TextInput,
    Stack,
    ActionIcon,
    Flex,
    Text,
} from "@mantine/core";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import useModalStore from "@/Modules/Common/Hooks/use-modal-store";
import { DashboardMetadataResourceData } from "../Types/DashboardMetadataResourceData";

interface MetadataFilter {
    id: number;
    field: string;
    operator: string;
    value: string;
}

interface MetadataFilterModalProps {
    availableMetadata: DashboardMetadataResourceData[];
    onApplyFilters: (filters: Omit<MetadataFilter, "id">[]) => void;
}

const MetadataFilterModal: React.FC<MetadataFilterModalProps> = ({
    availableMetadata,
    onApplyFilters,
}) => {
    const { modals, closeModal } = useModalStore();
    const isOpen = modals["metadataFilterModal"];

    const [filters, setFilters] = useState<MetadataFilter[]>([
        { id: Date.now(), field: "", operator: "", value: "" },
    ]);

    const handleAddFilter = () => {
        setFilters([
            ...filters,
            { id: Date.now(), field: "", operator: "", value: "" },
        ]);
    };

    const handleRemoveFilter = (id: number) => {
        setFilters(filters.filter((filter) => filter.id !== id));
    };

    const handleChange = (
        id: number,
        key: keyof Omit<MetadataFilter, "id">,
        value: string
    ) => {
        setFilters(
            filters.map((filter) =>
                filter.id === id ? { ...filter, [key]: value } : filter
            )
        );
    };

    const handleApplyFilters = () => {
        // Exclude 'id' from each filter before sending
        const formattedFilters = filters.map(({ field, operator, value }) => ({
            field,
            operator,
            value,
        }));
        onApplyFilters(formattedFilters);
        closeModal("metadataFilterModal");
    };

    const handleClearFilters = () => {
        setFilters([{ id: Date.now(), field: "", operator: "", value: "" }]);
        onApplyFilters([]);
        closeModal("metadataFilterModal");
    };

    return (
        <Modal
            opened={isOpen}
            onClose={() => closeModal("metadataFilterModal")}
            title="Filter by Metadata"
            size="lg"
        >
            <Stack>
                {filters.map((filter) => (
                    <Group key={filter.id} align="flex-end">
                        <Select
                            label="Field"
                            placeholder="Select field"
                            data={availableMetadata.map((meta) => ({
                                value: meta.name,
                                label: meta.name,
                            }))}
                            value={filter.field}
                            onChange={(value) =>
                                handleChange(filter.id, "field", value || "")
                            }
                            required
                            style={{ flex: 1 }}
                        />
                        <Select
                            label="Operator"
                            placeholder="Select operator"
                            data={[
                                { value: "includes", label: "Includes" },
                                { value: "excludes", label: "Excludes" },
                                { value: "is", label: "Is" },
                                { value: "is_not", label: "Is Not" },
                            ]}
                            value={filter.operator}
                            onChange={(value) =>
                                handleChange(filter.id, "operator", value || "")
                            }
                            required
                            style={{ flex: 1 }}
                        />
                        <TextInput
                            label="Value"
                            placeholder="Enter value"
                            value={filter.value}
                            onChange={(e) =>
                                handleChange(filter.id, "value", e.target.value)
                            }
                            required
                            style={{ flex: 2 }}
                        />
                        {filters.length > 1 && (
                            <ActionIcon
                                color="red"
                                variant="subtle"
                                onClick={() => handleRemoveFilter(filter.id)}
                            >
                                <IconTrash size={16} />
                            </ActionIcon>
                        )}
                    </Group>
                ))}
                <Button
                    variant="light"
                    color="blue.5"
                    leftSection={<IconPlus size={18} />}
                    onClick={handleAddFilter}
                >
                    Add New Filter
                </Button>
                <Flex justify="flex-end" mt="md">
                    <Button variant="outline" onClick={handleClearFilters}>
                        Clear Filters
                    </Button>
                    <Button ml={12} onClick={handleApplyFilters}>
                        Apply Filters
                    </Button>
                </Flex>
            </Stack>
        </Modal>
    );
};

export default MetadataFilterModal;
