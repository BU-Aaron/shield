import { Head } from "@inertiajs/react";
import { Flex, rem, Stack, Text, TextInput } from "@mantine/core";
import { Authenticated } from "@/Modules/Common/Layouts/AuthenticatedLayout/Authenticated";
import ActivityLogTable from "@/Modules/ActivityLog/Components/ActivityLogTable";
import FilterForm from "@/Modules/ActivityLog/Forms/FilterForm";
import { usePaginateDataTable } from "@/Modules/Common/Hooks/use-paginate-datatable";
import { Filters, PaginationData } from "@/Modules/ActivityLog/Types/ActivityLogPageTypes";
import { useSearchDataTable } from "@/Modules/Common/Hooks/use-search-datatable";
import { IconSearch } from "@tabler/icons-react";

interface IProps {
    activityLogs: PaginationData;
    filters: Filters;
}

export default function FolderActivityLogPage({ activityLogs, filters }: IProps) {
    const { search, setSearch, handleSearch } = useSearchDataTable(filters.search || "", "/activity-log");
    const { page, setPage, handlePageChange } = usePaginateDataTable(activityLogs.current_page);

    return (
        <Authenticated>
            <Head title="Activity Log" />
            <Stack px={8} gap={24} py={8}>
                <Text component="h2" size="xl" fw={600} color="gray.8">
                    Activity Log
                </Text>

                <Flex
                    justify="space-between"
                    direction={{ base: "column", md: "row" }}
                    gap={{ base: 12, md: 0 }}
                >
                    <TextInput
                        w={{ md: 400 }}
                        placeholder="Search"
                        leftSection={<IconSearch style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            handleSearch(e.target.value);
                        }}
                    />
                    <FilterForm users={[]} objectTypes={[]} />
                </Flex>

                <ActivityLogTable
                    records={activityLogs.data}
                    totalRecords={activityLogs.total}
                    recordsPerPage={activityLogs.per_page}
                    page={page}
                    onPageChange={(p) => {
                        setPage(p);
                        handlePageChange(p, activityLogs.links);
                    }}
                />
            </Stack>
        </Authenticated>
    );
}