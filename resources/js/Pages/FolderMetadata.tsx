import {
    ActionIcon,
    Button,
    Group,
    Stack,
    Text,
    Modal,
    TextInput,
    Center,
} from "@mantine/core";
import { DataTable } from "mantine-datatable";
import { IconTrash, IconPlus, IconInbox, IconTagsOff } from "@tabler/icons-react";
import { useState } from "react";
import { FolderRequiredMetadataResource } from "@/Modules/Folder/Types/FolderRequiredMetadataResource";
import { Authenticated } from "@/Modules/Common/Layouts/AuthenticatedLayout/Authenticated";
import { Head } from "@inertiajs/react";
import AddRequiredMetadataModal from "@/Modules/Folder/Forms/AddRequiredMetadataModal";
import useModalStore from "@/Modules/Common/Hooks/use-modal-store";
import { useAddRequiredMetadata } from "@/Modules/Folder/Hooks/use-add-required-metadata";
import { useDeleteRequiredMetadata } from "@/Modules/Folder/Hooks/use-delete-required-metadata";

interface FolderMetadataProps {
    requiredMetadata: FolderRequiredMetadataResource[];
    folder: {
        item_id: string;
        name: string;
    };
}

export default function FolderMetadataPage({ requiredMetadata, folder }: FolderMetadataProps) {
    const { openModal, closeModal } = useModalStore();
    const { handleAddMetadata } = useAddRequiredMetadata({
        folderId: folder.item_id,
        close: () => closeModal("addRequiredMetadata"),
    });

    const [metadataToDelete, setMetadataToDelete] = useState<number | null>(null);

    const { handleDelete, processing: deleting } = useDeleteRequiredMetadata({
        folderId: folder.item_id,
        metadataId: metadataToDelete || 0,
        onDeleteSuccess: () => {
            setMetadataToDelete(null);
            // Optionally, refresh data or update state
        },
    });

    const confirmDelete = (metadataId: number) => {
        setMetadataToDelete(metadataId);
    };

    return (
        <Authenticated>
            <Head title="Required Metadata" />

            <Stack gap={24} p={8}>
                <Group justify="space-between">
                    <Text component="h2" size="xl" fw={600} c="gray.8">
                        Required Metadata for {folder.name}
                    </Text>

                    <Button leftSection={<IconPlus size={16} />} onClick={() => openModal("addRequiredMetadata")}>
                        Add Required Metadata
                    </Button>
                </Group>

                {requiredMetadata.length > 0 ? (
                    <DataTable
                        columns={[
                            { accessor: "name", title: "Name" },
                            { accessor: "description", title: "Description" },
                            {
                                accessor: "actions",
                                title: "Actions",
                                render: (metadata) => (
                                    <Group gap="xs">
                                        <ActionIcon color="red" onClick={() => confirmDelete(metadata.metadata_id)}>
                                            <IconTrash size={16} />
                                        </ActionIcon>
                                    </Group>
                                ),
                            },
                        ]}
                        textSelectionDisabled
                        records={requiredMetadata}
                        highlightOnHover
                        verticalSpacing="lg"
                        horizontalSpacing="xl"
                    />
                ) : (
                    <Stack align="center" justify="center" h="100%">
                        <IconTagsOff size={128} color="gray" stroke={1} />
                        <Text size="lg" c="gray.6" mt="md">
                            No required metadata available.
                        </Text>
                    </Stack>
                )}

                <AddRequiredMetadataModal folderId={folder.item_id} onAdd={handleAddMetadata} />

                {/* Confirmation Modal for Deletion */}
                <Modal
                    opened={metadataToDelete !== null}
                    onClose={() => setMetadataToDelete(null)}
                    title="Confirm Deletion"
                >
                    <Text>Are you sure you want to delete this required metadata?</Text>
                    <Group justify="right" mt="md">
                        <Button variant="outline" onClick={() => setMetadataToDelete(null)}>
                            Cancel
                        </Button>
                        <Button color="red" onClick={handleDelete} loading={deleting}>
                            Delete
                        </Button>
                    </Group>
                </Modal>
            </Stack>
        </Authenticated>
    );
}