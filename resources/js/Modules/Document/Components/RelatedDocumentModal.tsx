import React, { useState } from "react";
import {
    Modal,
    Button,
    Stack,
    Group,
    Text,
    ActionIcon,
    Divider,
} from "@mantine/core";
import { IconChevronLeft } from "@tabler/icons-react";
import useShowItems from "../Hooks/use-show-items-for-moving";
import useModalStore from "@/Modules/Common/Hooks/use-modal-store";
import { ItemIcon } from "@/Modules/Common/Components/ItemIcon/ItemIcon";
import { notifications } from "@mantine/notifications";

interface RelatedDocumentModalProps {
    onAdd: (document: { item_id: string; name: string }) => void;
}

const RelatedDocumentModal: React.FC<RelatedDocumentModalProps> = ({
    onAdd,
}) => {
    const { modals, closeModal } = useModalStore();
    const isOpen = modals["relatedDocumentModal"];
    const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
    const { data, loading, error } = useShowItems(currentFolderId, isOpen);

    const handleFolderClick = (folderId: string) => {
        setCurrentFolderId(folderId);
    };

    const handleBack = () => {
        if (data.itemParent && data.itemParent.parent_id) {
            setCurrentFolderId(data.itemParent.parent_id);
        } else {
            setCurrentFolderId(null);
        }
    };

    const handleSelectDocument = (document: {
        item_id: string;
        name: string;
    }) => {
        onAdd(document);
        closeModal("relatedDocumentModal");
        setCurrentFolderId(null);
    };

    return (
        <Modal
            opened={isOpen}
            onClose={() => closeModal("relatedDocumentModal")}
            title={<Text fw={500}>Select Related Document</Text>}
            size="lg"
        >
            <Stack gap="md">
                <Group>
                    {currentFolderId && (
                        <ActionIcon onClick={handleBack}>
                            <IconChevronLeft size={16} />
                        </ActionIcon>
                    )}
                    <Text c="dark.5" fw={500}>
                        Choose Related Document
                    </Text>
                </Group>

                <Divider />

                {loading ? (
                    <Text>Loading...</Text>
                ) : error ? (
                    <Text color="red">{error}</Text>
                ) : (
                    <Stack
                        gap="sm"
                        style={{ maxHeight: 400, overflowY: "auto" }}
                    >
                        {data.itemContents.map((item) => (
                            <Group
                                key={item.item_id}
                                gap="sm"
                                style={{ cursor: "pointer" }}
                                onClick={() => {
                                    if (item.type === "folder") {
                                        handleFolderClick(item.item_id);
                                    } else {
                                        handleSelectDocument({
                                            item_id: item.item_id,
                                            name: item.name,
                                        });
                                    }
                                }}
                            >
                                <ItemIcon
                                    mime={item.mime ?? ""}
                                    isFolder={item.type === "folder"}
                                />
                                <Text>{item.name}</Text>
                            </Group>
                        ))}
                    </Stack>
                )}
                <Group justify="flex-end" mt="md">
                    <Button
                        variant="outline"
                        onClick={() => closeModal("relatedDocumentModal")}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={() => {
                            if (currentFolderId) {
                                // Implement any additional save logic if needed
                                closeModal("relatedDocumentModal");
                            } else {
                                notifications.show({
                                    position: "top-center",
                                    message:
                                        "Please select a document to relate.",
                                    color: "red",
                                });
                            }
                        }}
                        disabled={!currentFolderId}
                    >
                        Relate
                    </Button>
                </Group>
            </Stack>
        </Modal>
    );
};

export default RelatedDocumentModal;
