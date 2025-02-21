import React from 'react';
import { DataTable } from 'mantine-datatable';
import { Group, Stack, Text } from '@mantine/core';
import { IconFolder, IconFile, IconSearchOff } from '@tabler/icons-react';
import { SearchResults, DocumentSearchResult, FolderSearchResult } from '@/Modules/GlobalSearch/Types/SearchResultTypes';
import { Authenticated } from '@/Modules/Common/Layouts/AuthenticatedLayout/Authenticated';
import { useDocumentProperties } from "@/Modules/Item/Hooks/use-document-properties";
import { ItemIcon } from "@/Modules/Common/Components/ItemIcon/ItemIcon";

interface Props {
    documents: DocumentSearchResult[];
    query: string;
}

const SearchItemsResult: React.FC<Props> = ({ documents, query }) => {
    const combinedResults = [
        ...documents.map(doc => ({ ...doc, type: 'document' as const })),
    ];

    const { openDocument } = useDocumentProperties();

    return (
        <Authenticated>
            <Stack px={8} py={8} gap={24}>
                <Text component="h2" size="xl" fw={600} color="gray.8">
                    Search Results for "{query}"
                </Text>

                {combinedResults.length > 0 ? (
                    <DataTable
                        columns={[
                            {
                                accessor: "name",
                                render: ({ mime, type, name, status, missing_required_metadata }) => (
                                    <Group align="center" gap={12}>
                                        <ItemIcon
                                            mime={mime ?? ""}
                                            isFolder={false}  // TODO: should check if the item is a folder or document
                                            approvalStatus={status}
                                            missingRequiredMetadata={missing_required_metadata}
                                        />
                                        <span>{name}</span>
                                    </Group>
                                ),
                            },
                            { accessor: 'document_number', title: 'Document Number', hidden: true },
                        ]}
                        records={combinedResults}
                        highlightOnHover
                        verticalSpacing="lg"
                        horizontalSpacing="xl"
                        textSelectionDisabled
                        customRowAttributes={({ type, id }) => ({
                            onDoubleClick: (e: MouseEvent) => {
                                if (e.button === 0) {
                                    openDocument(id);
                                }
                            },
                        })}
                    />
                ) : (
                    <Stack align="center" justify="center" h="100%">
                        <IconSearchOff size={128} color="gray" stroke={1} />
                        <Text size="lg" c="gray.6" mt="md">
                            No results found.
                        </Text>
                    </Stack>
                )}


            </Stack>
        </Authenticated>
    );
};

export default SearchItemsResult;