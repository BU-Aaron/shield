import { useState } from "react";
import { Head } from "@inertiajs/react";
import {
    ActionIcon,
    Box,
    Button,
    Group,
    Flex,
    rem,
    Stack,
    Text,
    TextInput,
} from "@mantine/core";
import { IconEdit, IconPlus, IconSearch, IconTrash } from "@tabler/icons-react";
import { Authenticated } from "@/Modules/Common/Layouts/AuthenticatedLayout/Authenticated";
import CreateMetadataForm from "@/Modules/Metadata/Forms/CreateMetadataForm";
import UpdateMetadataForm from "@/Modules/Metadata/Forms/UpdateMetadataForm";
import DeleteMetadataForm from "@/Modules/Metadata/Forms/DeleteMetadataForm";
import { useSearchDataTable } from "@/Modules/Common/Hooks/use-search-datatable";
import { usePaginateDataTable } from "@/Modules/Common/Hooks/use-paginate-datatable";
import { MetadataResourceData } from "@/Modules/Metadata/Types/MetadataResourceData";
import useModalStore from "@/Modules/Common/Hooks/use-modal-store";
import {
    PaginationData,
    Filters,
} from "@/Modules/Common/Types/CommonPageTypes";
import { DataTable } from "mantine-datatable";

interface IProps {
    metadata: PaginationData<MetadataResourceData>;
    filters: Filters;
}

export default function MetadataPage({ metadata, filters }: IProps) {
    const [selectedRecord, setSelectedRecord] = useState<
        MetadataResourceData[]
    >([]);
    const [currentMetadata, setCurrentMetadata] =
        useState<MetadataResourceData>();

    const { search, setSearch, handleSearch } = useSearchDataTable(
        filters.search || "",
        "/metadata"
    );
    const { page, setPage, handlePageChange } = usePaginateDataTable(
        metadata.current_page
    );

    const { modals, openModal, closeModal } = useModalStore();

    const handleEditMetadata = (metadata: MetadataResourceData) => {
        setCurrentMetadata(metadata);
        openModal("editMetadata");
    };

    const handleDeleteMetadata = (metadata: MetadataResourceData) => {
        setCurrentMetadata(metadata);
        openModal("deleteMetadata");
    };

    return (
        <Authenticated>
            <Head title="Metadata" />
            <Stack px={8} py={8} gap={24}>
                <Text component="h2" size="xl" fw={600} c="gray.8">
                    Tags
                </Text>
                <Flex
                    justify="space-between"
                    direction={{ base: "column", md: "row" }}
                    gap={{ base: 12, md: 0 }}
                >
                    <TextInput
                        w={{ md: 400 }}
                        placeholder="Search"
                        leftSection={
                            <IconSearch
                                style={{ width: rem(16), height: rem(16) }}
                                stroke={1.5}
                            />
                        }
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            handleSearch(e.target.value);
                        }}
                    />
                    <Button
                        leftSection={<IconPlus size={14} />}
                        onClick={() => openModal("addMetadata")}
                    >
                        Add New Metadata
                    </Button>
                </Flex>

                <DataTable
                    pinLastColumn
                    withTableBorder
                    shadow="xs"
                    minHeight={"50vh"}
                    borderRadius="sm"
                    withRowBorders={false}
                    highlightOnHover
                    verticalSpacing="md"
                    totalRecords={metadata.total}
                    recordsPerPage={metadata.per_page}
                    page={page}
                    onPageChange={(p) => {
                        setPage(p);
                        handlePageChange(p, metadata.links);
                    }}
                    columns={[
                        { accessor: "name", noWrap: true },
                        { accessor: "type", noWrap: true },
                        {
                            accessor: "actions",
                            title: <Box mr={6}>Actions</Box>,
                            textAlign: "right",
                            render: (metadata) => (
                                <Group gap={8} justify="right" wrap="nowrap">
                                    <ActionIcon
                                        size="sm"
                                        variant="subtle"
                                        color="gray"
                                        onClick={() =>
                                            handleEditMetadata(metadata)
                                        }
                                    >
                                        <IconEdit size={48} />
                                    </ActionIcon>
                                    <ActionIcon
                                        size="sm"
                                        variant="subtle"
                                        color="red"
                                        onClick={() =>
                                            handleDeleteMetadata(metadata)
                                        }
                                    >
                                        <IconTrash size={48} />
                                    </ActionIcon>
                                </Group>
                            ),
                        },
                    ]}
                    records={metadata.data}
                    selectedRecords={selectedRecord}
                    onSelectedRecordsChange={setSelectedRecord}
                />
            </Stack>

            <CreateMetadataForm
                isOpened={modals["addMetadata"]}
                close={() => closeModal("addMetadata")}
            />
            <UpdateMetadataForm
                isOpened={modals["editMetadata"]}
                close={() => closeModal("editMetadata")}
                metadata={currentMetadata}
            />
            <DeleteMetadataForm
                isOpened={modals["deleteMetadata"]}
                close={() => closeModal("deleteMetadata")}
                metadata={currentMetadata}
            />
        </Authenticated>
    );
}
