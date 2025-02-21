import { useEffect, useRef, useState } from "react";
import { sortBy } from "lodash";
import { Head } from "@inertiajs/react";
import { Group, Stack, Text } from "@mantine/core";
import {
    DataTable,
    DataTableColumn,
    type DataTableSortStatus,
} from "mantine-datatable";

import { ItemIcon } from "@/Modules/Common/Components/ItemIcon/ItemIcon";
import { Authenticated } from "@/Modules/Common/Layouts/AuthenticatedLayout/Authenticated";

import ItemBreadcrumbs from "@/Modules/Item/Components/ItemBreadcrumbs";
import ItemDropzone from "@/Modules/Item/Components/ItemDropzone";
import ItemToolbar from "@/Modules/Item/Components/ItemToolbar";
import SelectedItemToolbar from "@/Modules/Item/Components/ItemSelectedToolbar";

import { useUploadDocument } from "@/Modules/Document/Hooks/use-upload-document";
import { useSelectItems } from "@/Modules/Item/Hooks/use-select-items";
import { useDocumentProperties } from "@/Modules/Item/Hooks/use-document-properties";
import { useOpenFolder } from "@/Modules/Item/Hooks/use-open-folder";

import { ItemAncestorsResourceData } from "@/Modules/Item/Types/ItemAncestorsResourceData";
import { ItemContentsResourceData } from "@/Modules/Item/Types/ItemContentsResourceData";
import { ItemParentResourceData } from "@/Modules/Item/Types/ItemParentResourceData";
import SelectMetadataColumnForm from "@/Modules/Common/Components/SelectMetadataColumn/SelectMetadataColumnForm";
import StateBadge from "@/Modules/Common/Components/StateBadge/StateBadge";

interface ItemPageProps {
    itemParent: ItemParentResourceData;
    itemAncestors: ItemAncestorsResourceData[];
    itemContents: ItemContentsResourceData[];
    folderUserRole?: "viewer" | "editor";
}

export default function ItemPage({
    itemParent,
    itemAncestors,
    itemContents,
    folderUserRole,
}: ItemPageProps) {
    const openRef = useRef<() => void>(null);
    const { uploadFiles } = useUploadDocument(itemParent);
    const { selectedRecord, setSelectedRecord, ids } = useSelectItems();
    const { openFolder } = useOpenFolder();
    const { openDocument } = useDocumentProperties();

    const [sortStatus, setSortStatus] = useState<
        DataTableSortStatus<ItemContentsResourceData>
    >({
        columnAccessor: "name",
        direction: "asc",
    });
    const [records, setRecords] = useState(sortBy(itemContents, "name"));

    useEffect(() => {
        const data = sortBy(
            itemContents,
            sortStatus.columnAccessor
        ) as ItemContentsResourceData[];
        setRecords(sortStatus.direction === "desc" ? data.reverse() : data);
    }, [sortStatus, itemContents]);

    const dynamicColumns: DataTableColumn<ItemContentsResourceData>[] =
        itemParent.metadata_columns?.map((metadata) => ({
            accessor: `metadata_${metadata.metadata_id}`, // Changed accessor to include metadata_id
            title: metadata.name,
            render: (record: ItemContentsResourceData) => {
                const metadataItem = record.metadata?.find(
                    (m) => m.metadata_id === metadata.metadata_id
                );
                return metadataItem ? metadataItem.value : null;
            },
            sortable: true,
            ellipsis: true,
        })) ?? [];

    const metadataColumns: DataTableColumn<ItemContentsResourceData>[] = [
        {
            accessor: "name",
            render: ({
                mime,
                type,
                name,
                approval_status,
                review_status,
                missing_required_metadata,
            }) => (
                <Group align="center" gap={12} preventGrowOverflow>
                    <ItemIcon
                        mime={mime ?? ""}
                        isFolder={type === "folder"}
                        reviewStatus={review_status}
                        approvalStatus={approval_status}
                        missingRequiredMetadata={missing_required_metadata}
                    />
                    <span>{name}</span>
                </Group>
            ),
            sortable: true,
            ellipsis: true,
        },
        {
            accessor: "updated_at",
            title: "Last Modified",
            sortable: true,
            ellipsis: true,
        },
        ...(dynamicColumns ?? []),
    ];

    return (
        <>
            <Head title="My Files" />

            <Authenticated
                toolbar={
                    selectedRecord.length > 0 ? (
                        <SelectedItemToolbar
                            setSelectedRecord={setSelectedRecord}
                            selectedIds={ids}
                            parentId={itemParent.item_id}
                        />
                    ) : (
                        <ItemToolbar
                            itemParent={{
                                ...itemParent,
                            }}
                            folderUserRole={folderUserRole}
                            uploadFileRef={openRef}
                        />
                    )
                }
            >
                <ItemDropzone onDrop={uploadFiles} openRef={openRef}>
                    <Stack
                        px={8}
                        gap={24}
                        py={8}
                        style={{ pointerEvents: "all" }}
                    >
                        <ItemBreadcrumbs ancestors={itemAncestors} />

                        {!itemContents.length ? (
                            <Text size="lg" c="gray.5">
                                This folder is empty
                            </Text>
                        ) : (
                            <DataTable
                                textSelectionDisabled
                                columns={metadataColumns}
                                records={records}
                                customRowAttributes={({ type, id }) => ({
                                    onDoubleClick: (e: MouseEvent) => {
                                        if (e.button === 0) {
                                            // TODO: Simplify this
                                            if (type === "folder") {
                                                openFolder(type, id);
                                            } else if (type === "document") {
                                                openDocument(id);
                                            }
                                        }
                                    },
                                })}
                                highlightOnHover
                                verticalSpacing="lg"
                                horizontalSpacing="xl"
                                selectedRecords={selectedRecord}
                                onSelectedRecordsChange={setSelectedRecord}
                                sortStatus={sortStatus}
                                onSortStatusChange={setSortStatus}
                            />
                        )}
                    </Stack>
                </ItemDropzone>
            </Authenticated>

            <SelectMetadataColumnForm folderId={itemParent.item_id} />
        </>
    );
}
