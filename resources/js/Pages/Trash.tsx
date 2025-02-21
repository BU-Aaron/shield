import { Head } from "@inertiajs/react";
import { Group, Stack, Text } from "@mantine/core";
import { Authenticated } from "@/Modules/Common/Layouts/AuthenticatedLayout/Authenticated";
import { DataTable } from "mantine-datatable";
import { ItemIcon } from "@/Modules/Common/Components/ItemIcon/ItemIcon";
import { useSelectItems } from "@/Modules/Common/Hooks/use-select-items";
import { TrashedItemsResourceData } from "@/Modules/Trash/Types/TrashedItemsResourceData";
import TrashSelectedToolbar from "@/Modules/Trash/Components/TrashSelectedToolbar";
import TrashToolbar from "@/Modules/Trash/Components/TrashToolbar";

interface TrashPageProps {
    trashedItems: TrashedItemsResourceData[];
}

export default function TrashPage({ trashedItems }: TrashPageProps) {
    const { selectedRecord, setSelectedRecord, ids } = useSelectItems();

    return (
        <>
            <Head title="Trash" />

            <Authenticated
                toolbar={
                    // <Toolbar
                    //     fileSelected={selectedRecord.length > 0}
                    //     selectedIds={ids}
                    //     page="trash"
                    // />

                    selectedRecord.length > 0 ? (
                        <TrashSelectedToolbar selectedIds={ids} />
                    ) : (
                        <TrashToolbar />
                    )
                }
            >
                <Head title="My Files" />

                <Stack px={8} gap={24} py={8} style={{ pointerEvents: "all" }}>
                    <Text fw={500}>Trash</Text>

                    {trashedItems.length === 0 ? (
                        <Text size="lg" c="gray.5">
                            This trash bin is empty
                        </Text>
                    ) : (
                        <DataTable
                            textSelectionDisabled
                            columns={[
                                {
                                    accessor: "name",
                                    render: ({ mime, type, name }) => (
                                        <Group align="center" gap={12}>
                                            <ItemIcon mime={mime} isFolder={type === 'folder'} />
                                            <span>{name}</span>
                                        </Group>
                                    ),
                                },
                                { accessor: "deleted_at" },
                            ]}
                            records={trashedItems}
                            highlightOnHover
                            verticalSpacing="lg"
                            horizontalSpacing="xl"
                            selectedRecords={selectedRecord}
                            onSelectedRecordsChange={setSelectedRecord}
                        />
                    )}
                </Stack>
            </Authenticated>
        </>
    );
}