import { useState } from "react";
import { Head } from "@inertiajs/react";
import { Stack, Text, Button, Flex, TextInput, rem } from "@mantine/core";
import { IconPlus, IconSearch } from "@tabler/icons-react";
import { Authenticated } from "@/Modules/Common/Layouts/AuthenticatedLayout/Authenticated";
import NumberingSchemeTable from "@/Modules/NumberingScheme/Components/NumberingSchemeTable";
import { NumberingSchemeResourceData } from "@/Modules/NumberingScheme/Types/NumberingSchemeResourceData";
import { useSearchDataTable } from "@/Modules/Common/Hooks/use-search-datatable";
import { usePaginateDataTable } from "@/Modules/Common/Hooks/use-paginate-datatable";
import { Filters, PaginationData } from "@/Modules/NumberingScheme/Types/NumberingSchemePageTypes";
import { UpdateNumberingSchemeForm } from "@/Modules/NumberingScheme/Forms/UpdateNumberingSchemeForm"; // Import the form
import useModalStore from "@/Modules/Common/Hooks/use-modal-store";
import { ItemParentResourceData } from "@/Modules/Item/Types/ItemParentResourceData";

interface IProps {
    numberingSchemes: PaginationData;
    filters: Filters;
    itemParent: ItemParentResourceData; // Assume this prop is available
}

export default function NumberingSchemePage({ numberingSchemes, filters, itemParent }: IProps) {
    const [selectedRecord, setSelectedRecord] = useState<NumberingSchemeResourceData[]>([]);
    const [editingScheme, setEditingScheme] = useState<NumberingSchemeResourceData | null>(null);

    const { search, setSearch, handleSearch } = useSearchDataTable(filters.search || "", "/numbering-scheme");
    const { page, setPage, handlePageChange } = usePaginateDataTable(numberingSchemes.current_page);

    const { openModal, closeModal } = useModalStore();

    const handleEdit = (scheme: NumberingSchemeResourceData) => {
        setEditingScheme(scheme);
        openModal("updateNumberingScheme");
    };

    const closeForm = () => {
        setEditingScheme(null);
        closeModal("updateNumberingScheme");
    };

    return (
        <Authenticated>
            <Head title="Numbering Scheme" />
            <Stack px={8} gap={24} py={8}>
                <Text component="h2" size="xl" fw={600} c="gray.8">
                    Numbering Scheme
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
                            <IconSearch style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
                        }
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            handleSearch(e.target.value);
                        }}
                    />
                </Flex>

                <NumberingSchemeTable
                    records={numberingSchemes.data}
                    totalRecords={numberingSchemes.total}
                    recordsPerPage={numberingSchemes.per_page}
                    page={page}
                    onPageChange={(p) => {
                        setPage(p);
                        handlePageChange(p, numberingSchemes.links);
                    }}
                    selectedRecords={selectedRecord}
                    onSelectedRecordsChange={setSelectedRecord}
                    onEdit={handleEdit} // Pass the handler
                />

                {/* Render the UpdateNumberingSchemeForm modal */}
                {editingScheme && (
                    <UpdateNumberingSchemeForm
                        itemParent={{
                            ...itemParent,
                            numbering_scheme_id: editingScheme.id, // Pass the selected scheme's ID
                        }}
                    // Optionally, you can pass additional props if needed
                    />
                )}
            </Stack>
        </Authenticated>
    );
};
