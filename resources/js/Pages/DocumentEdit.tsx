import React, { useState } from "react";
import { Head, router } from "@inertiajs/react";
import {
    ActionIcon,
    Box,
    Button,
    Flex,
    Group,
    Stack,
    Text,
    Textarea,
    TextInput,
} from "@mantine/core";
import { Authenticated } from "@/Modules/Common/Layouts/AuthenticatedLayout/Authenticated";
import { IconEdit, IconFile, IconPlus } from "@tabler/icons-react";
import { DocumentResourceData } from "@/Modules/Document/Types/DocumentResourceData";
import { ItemAncestorsResourceData } from "@/Modules/Item/Types/ItemAncestorsResourceData";
import ItemBreadcrumbs from "@/Modules/Item/Components/ItemBreadcrumbs";
import MetadataInput from "@/Modules/Document/Components/MetadataInput";
import RelatedFilesInput from "@/Modules/Document/Components/RelatedFilesInput";
import { useUpdateDocument } from "@/Modules/Document/Hooks/use-update-document";
import { DocumentMetadata } from "@/Modules/Document/Types/DocumentMetadata";
import { DatePickerInput } from "@mantine/dates";
import { ItemIcon } from "@/Modules/Common/Components/ItemIcon/ItemIcon";

interface IProps {
    document: DocumentResourceData;
    itemAncestors: ItemAncestorsResourceData[];
}

export default function DocumentEditPage({ document, itemAncestors }: IProps) {
    const { data, setData, handleUpdateDocument, processing, errors, reset } =
        useUpdateDocument({ document });

    const [deletedMetadataIds, setDeletedMetadataIds] = useState<number[]>([]);

    const handleMetadataAdd = (metadata: DocumentMetadata) => {
        setData("update_metadata", [...(data.update_metadata || []), metadata]);
    };

    const handleMetadataUpdate = (updatedMetadata: DocumentMetadata[]) => {
        data.update_metadata = updatedMetadata;
    };

    const handleMetadataChange = (updatedMetadata: DocumentMetadata[]) => {
        setData("update_metadata", updatedMetadata);
    };

    const handleMetadataDelete = (metadataId: number) => {
        setDeletedMetadataIds((prev) => [...prev, metadataId]);
        setData("delete_metadata", [
            ...(data.delete_metadata || []),
            { metadata_id: metadataId },
        ]);
    };

    const handleRelatedDocsChange = (
        updatedRelatedDocs: { item_id: string; name: string }[]
    ) => {
        setData("related_documents", updatedRelatedDocs);
    };

    return (
        <Authenticated>
            <Head title="Document Properties" />
            <Box px={8} py={8}>
                <ItemBreadcrumbs ancestors={itemAncestors} />
            </Box>
            <Stack px={8} py={8} gap={24} w={550} mb={72}>
                <Group mt={24} align="center">
                    <ItemIcon
                        mime={document.mime}
                        isFolder={false}
                        reviewStatus={document.review_status}
                        approvalStatus={document.approval_status}
                    />
                    <Text fw={500}>{data.name}</Text>
                    <ActionIcon variant="subtle" color="gray">
                        <IconEdit size={24} />
                    </ActionIcon>
                </Group>

                <form onSubmit={handleUpdateDocument}>
                    <Stack gap={12}>
                        <TextInput
                            label="Document Number"
                            name="document_number"
                            value={data.document_number}
                            onChange={(e) =>
                                setData("document_number", e.target.value)
                            }
                            placeholder="Enter document number"
                        />

                        <TextInput
                            type="text"
                            label="Created At"
                            value={document.created_at}
                            disabled
                        />

                        <Textarea
                            label="Description"
                            autosize
                            minRows={4}
                            maxRows={6}
                            placeholder="Enter description"
                            value={data.description}
                            onChange={(e) =>
                                setData("description", e.target.value)
                            }
                        />

                        <DatePickerInput
                            label="Due Date"
                            placeholder="Select due date"
                            value={
                                data.due_date
                                    ? new Date(data.due_date)
                                    : undefined
                            }
                            onChange={(date: Date | null) =>
                                setData(
                                    "due_date",
                                    date?.toISOString() ?? undefined
                                )
                            }
                        />
                    </Stack>

                    <Stack gap={12} mt={16}>
                        <Text size="sm" fw={500}>
                            Custom Tags
                        </Text>

                        <MetadataInput
                            metadata={data.update_metadata ?? []}
                            requiredMetadata={document.required_folder_metadata}
                            onAdd={handleMetadataAdd}
                            onUpdate={handleMetadataUpdate}
                            onChange={handleMetadataChange}
                            onDelete={handleMetadataDelete}
                        />
                    </Stack>

                    <Stack gap={12} mt={16}>
                        <Text size="sm" fw={500}>
                            Related Documents
                        </Text>

                        <RelatedFilesInput
                            relatedDocuments={data.related_documents || []}
                            onChange={handleRelatedDocsChange}
                        />
                    </Stack>

                    <Flex align="center" justify="end" mt={16}>
                        <Button
                            variant="light"
                            onClick={() =>
                                router.visit(
                                    route("document.show", {
                                        document: document.item_id,
                                    })
                                )
                            }
                        >
                            Cancel
                        </Button>

                        <Button ml={12} type="submit" loading={processing}>
                            Save Changes
                        </Button>
                    </Flex>
                </form>
            </Stack>
        </Authenticated>
    );
}
