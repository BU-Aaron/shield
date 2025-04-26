import React from "react";
import { useState } from "react";
import { router } from "@inertiajs/react";
import { Head } from "@inertiajs/react";
import {
    Button,
    Group,
    Select,
    Stack,
    Text,
    Flex,
    TextInput,
} from "@mantine/core";
import {
    IconDownload,
    IconSearch,
    IconTable,
    IconFilter,
} from "@tabler/icons-react";
import { DataTable } from "mantine-datatable";
import { Authenticated } from "@/Modules/Common/Layouts/AuthenticatedLayout/Authenticated";
import { useSearchDataTable } from "@/Modules/Common/Hooks/use-search-datatable";
import { usePaginateDataTable } from "@/Modules/Common/Hooks/use-paginate-datatable";
import useGenerateDashboardReport from "@/Modules/Reports/Hooks/use-generate-dashboard-report";
import useModalStore from "@/Modules/Common/Hooks/use-modal-store";
import { PaginationData } from "@/Modules/Common/Types/CommonPageTypes";
import { MetadataResourceData } from "@/Modules/Metadata/Types/MetadataResourceData";
import SelectDashboardMetadataColumnForm from "@/Modules/Dashboard/Components/SelectDashboardMetadataColumnForm";
import MetadataFilterModal from "@/Modules/Dashboard/Components/MetadataFilterModal";
import { DashboardMetadataResourceData } from "@/Modules/Dashboard/Types/DashboardMetadataResourceData";
import { ItemContentsResourceData } from "@/Modules/Item/Types/ItemContentsResourceData";
import { DatePickerInput } from "@mantine/dates";
import { ItemIcon } from "@/Modules/Common/Components/ItemIcon/ItemIcon";
import StateBadge from "@/Modules/Common/Components/StateBadge/StateBadge";
import { useDocumentProperties } from "@/Modules/Item/Hooks/use-document-properties";

interface MetadataFilter {
    field: string;
    operator: string;
    value: string;
}

interface DashboardReportProps {
    documents: PaginationData<ItemContentsResourceData>;
    filters: {
        category: string | null;
        start_date: string | null;
        end_date: string | null;
        metadata_filters: MetadataFilter[];
    };
    selectedMetadata: MetadataResourceData[];
    availableMetadata: DashboardMetadataResourceData[];
    existingMetadataIds: number[];
    users: { id: number; name: string }[];
}

const DashboardReportPage: React.FC<DashboardReportProps> = ({
    documents,
    filters,
    selectedMetadata,
    availableMetadata,
    existingMetadataIds,
    users,
}) => {
    const [documentStatus, setDocumentStatus] = useState<string | null>(
        filters.category
    );
    const [startDate, setStartDate] = useState<Date | null>(
        filters.start_date ? new Date(filters.start_date) : null
    );
    const [endDate, setEndDate] = useState<Date | null>(
        filters.end_date ? new Date(filters.end_date) : null
    );
    const [uploader, setUploader] = useState<string | null>(null);
    const [dueIn, setDueIn] = useState<string | null>(null);
    const [metadataFilters, setMetadataFilters] = useState<MetadataFilter[]>(
        filters.metadata_filters || []
    );

    const { openDocument } = useDocumentProperties();

    const { search, setSearch, handleSearch } = useSearchDataTable(
        "",
        `/dashboard/reports`
    );
    const { page, setPage, handlePageChange } = usePaginateDataTable(
        documents.current_page
    );

    const { generateDashboardReport } = useGenerateDashboardReport();

    const { openModal } = useModalStore();

    /**
     * Consolidated handleFilter function that merges all active filters.
     */
    const handleFilter = (
        updatedFilters: Partial<{
            category: string | null;
            start_date: string | null;
            end_date: string | null;
            uploader: string | null;
            due_in: string | null;
            metadata_filters: {
                field: string;
                operator: string;
                value: string;
            }[];
            search: string;
            page: number;
        }>
    ) => {
        const query: any = {
            category:
                updatedFilters.category !== undefined
                    ? updatedFilters.category
                    : documentStatus,
            start_date:
                updatedFilters.start_date !== undefined
                    ? updatedFilters.start_date
                        ? new Date(
                            updatedFilters.start_date
                        ).toLocaleDateString("en-CA")
                        : null
                    : startDate
                        ? startDate.toLocaleDateString("en-CA")
                        : null,
            end_date:
                updatedFilters.end_date !== undefined
                    ? updatedFilters.end_date
                        ? new Date(updatedFilters.end_date).toLocaleDateString(
                            "en-CA"
                        )
                        : null
                    : endDate
                        ? endDate.toLocaleDateString("en-CA")
                        : null,
            uploader:
                updatedFilters.uploader !== undefined
                    ? updatedFilters.uploader
                    : uploader,
            due_in:
                updatedFilters.due_in !== undefined
                    ? updatedFilters.due_in
                    : dueIn,
            page:
                updatedFilters.page !== undefined ? updatedFilters.page : page,
            metadata_filters:
                updatedFilters.metadata_filters !== undefined
                    ? updatedFilters.metadata_filters.length > 0
                        ? updatedFilters.metadata_filters
                        : undefined
                    : metadataFilters.length > 0
                        ? metadataFilters
                        : undefined,
        };

        // Remove null or undefined query parameters
        Object.keys(query).forEach((key) => {
            if (
                query[key] === null ||
                query[key] === undefined ||
                (Array.isArray(query[key]) && query[key].length === 0)
            ) {
                delete query[key];
            }
        });

        // Navigate with Inertia to apply filters
        router.get(route("dashboard.reports"), query, {
            replace: true,
            preserveState: true,
        });
    };

    const handleDocumentStatusChange = (value: string | null) => {
        setDocumentStatus(value);
        handleFilter({ category: value, page: 1 }); // Reset to first page on filter change
    };

    const handleStartDateChange = (date: Date | null) => {
        setStartDate(date);
        handleFilter({
            start_date: date ? date.toLocaleDateString("en-CA") : null,
            page: 1, // Reset to first page on filter change
        });
    };

    const handleEndDateChange = (date: Date | null) => {
        setEndDate(date);
        handleFilter({
            end_date: date ? date.toLocaleDateString("en-CA") : null,
            page: 1, // Reset to first page on filter change
        });
    };

    const handleUploaderChange = (value: string | null) => {
        setUploader(value);
        handleFilter({ uploader: value, page: 1 });
    };

    const handleDueInChange = (value: string | null) => {
        setDueIn(value);
        handleFilter({ due_in: value, page: 1 });
    };

    const handlePageChangeInternal = (newPage: number) => {
        setPage(newPage);
        handleFilter({ page: newPage });
    };

    const handleGenerateReport = () => {
        const payload = {
            category: documentStatus,
            start_date: startDate
                ? startDate.toLocaleDateString("en-CA")
                : null,
            end_date: endDate ? endDate.toLocaleDateString("en-CA") : null,
            uploader: uploader,
            due_in: dueIn,
            metadata_ids: existingMetadataIds,
            metadata_filters: metadataFilters,
        };

        generateDashboardReport(payload);
    };

    /**
     * Handle clearing all filters.
     */
    const handleClearFilters = () => {
        setDocumentStatus(null);
        setStartDate(null);
        setEndDate(null);
        setUploader(null);
        setDueIn(null);
        setSearch("");
        setMetadataFilters([]);
        handleFilter({
            category: null,
            start_date: null,
            end_date: null,
            uploader: null,
            due_in: null,
            metadata_filters: [],
            search: "",
        });
    };

    const renderDynamicColumns = (): any[] => {
        return selectedMetadata.map((meta) => {
            // Conditionally render based on metadata type or other properties if needed
            return {
                accessor: `metadata_${meta.metadata_id}`,
                title: meta.name,
                render: (record: ItemContentsResourceData) => {
                    const metaValue = record.metadata?.find(
                        (m) => m.metadata_id === meta.metadata_id
                    );
                    return metaValue ? metaValue.value : "N/A";
                },
            };
        });
    };

    const handleApplyMetadataFilters = (
        filters: Omit<MetadataFilter, "id">[]
    ) => {
        setMetadataFilters(filters);
        handleFilter({ metadata_filters: filters, page: 1 });
    };

    return (
        <Authenticated>
            <Head title="Dashboard Report" />
            <Stack px={8} gap={24} py={8}>
                <Group>
                    <Text component="h2" size="xl" color="gray.8">
                        Dashboard Report
                    </Text>
                </Group>

                <Stack>
                    {/* Filter Options */}
                    <Group align="flex-end">
                        <Flex
                            gap="md"
                            justify="flex-start"
                            align="flex-end"
                            direction="row"
                            wrap="wrap"
                        >
                            <Select
                                placeholder="Select document status"
                                value={documentStatus}
                                onChange={handleDocumentStatusChange}
                                data={[
                                    {
                                        value: "INV",
                                        label: "INV",
                                    },
                                    {
                                        value: "INQ",
                                        label: "INQ",
                                    },
                                    {
                                        value: "UI",
                                        label: "UI",
                                    },
                                    {
                                        value: "Forensic Reports",
                                        label: "Forensic Reports",
                                    },
                                    {
                                        value: "Finance/Invest",
                                        label: "Finance/Invest",
                                    },
                                    {
                                        value: "Inventory Reports",
                                        label: "Inventory Reports",
                                    },
                                ]}
                                style={{ width: 200 }}
                            />

                            <Button
                                onClick={() =>
                                    openModal("selectDashboardMetadataColumns")
                                }
                                leftSection={<IconTable size={16} />}
                                variant="subtle"
                                color="dark.5"
                            >
                                Columns
                            </Button>

                            <Button
                                onClick={() => openModal("metadataFilterModal")}
                                leftSection={<IconFilter size={16} />}
                                variant="subtle"
                                color="gray.5"
                            >
                                Metadata Filters
                            </Button>
                        </Flex>

                        <Flex gap="sm">
                            {/* Clear Filters Button */}
                            <Button
                                onClick={handleClearFilters}
                                variant="subtle"
                                color="gray"
                                leftSection={<IconFilter size={16} />}
                            >
                                Clear Filters
                            </Button>
                        </Flex>
                    </Group>

                    {/* Select Dashboard Metadata Columns Modal */}
                    <SelectDashboardMetadataColumnForm
                        availableMetadata={availableMetadata}
                        existingMetadataIds={existingMetadataIds}
                    />

                    {/* Metadata Filter Modal */}
                    <MetadataFilterModal
                        availableMetadata={availableMetadata}
                        onApplyFilters={handleApplyMetadataFilters}
                    />

                    {/* Documents Table */}
                    <DataTable
                        columns={[
                            {
                                accessor: "name",
                                render: ({
                                    mime,
                                    type,
                                    name,
                                    missing_required_metadata,
                                }) => (
                                    <Group align="center" gap={12}>
                                        <ItemIcon
                                            mime={mime ?? ""}
                                            isFolder={type === "folder"}
                                            missingRequiredMetadata={
                                                missing_required_metadata
                                            }
                                        />
                                        <span>{name}</span>
                                    </Group>
                                ),
                            },
                            { accessor: "updated_at", title: "Last Modified" },
                            
                            // Dynamic columns including metadata fields
                            ...renderDynamicColumns(),
                        ]}
                        records={documents.data}
                        totalRecords={documents.total}
                        recordsPerPage={documents.per_page}
                        page={page}
                        onPageChange={handlePageChangeInternal}
                        highlightOnHover
                        verticalSpacing="lg"
                        horizontalSpacing="xl"
                        customRowAttributes={({ type, id }) => ({
                            onDoubleClick: (e: MouseEvent) => {
                                if (e.button === 0) {
                                    openDocument(id);
                                }
                            },
                        })}
                    />
                </Stack>
            </Stack>
        </Authenticated>
    );
};

export default DashboardReportPage;
