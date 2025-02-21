import React from "react";
import { Group, ActionIcon, Text, Button, Stack } from "@mantine/core";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import RelatedDocumentModal from "./RelatedDocumentModal";
import useModalStore from "@/Modules/Common/Hooks/use-modal-store";

interface RelatedDocument {
    item_id: string;
    name: string;
}

interface RelatedFilesInputProps {
    relatedDocuments: RelatedDocument[];
    onChange?: (relatedDocuments: RelatedDocument[]) => void;
}

const RelatedFilesInput: React.FC<RelatedFilesInputProps> = ({
    relatedDocuments,
    onChange,
}) => {
    const { openModal } = useModalStore();

    const handleAdd = (document: RelatedDocument) => {
        const updatedDocuments = [...relatedDocuments, document];
        if (onChange) onChange(updatedDocuments);
    };

    const handleRemove = (index: number) => {
        const newDocuments = relatedDocuments.filter((_, i) => i !== index);
        if (onChange) onChange(newDocuments);
    };

    return (
        <Stack>
            {relatedDocuments.map((doc, index) => (
                <Group
                    key={doc.item_id}
                    justify="space-between"
                    align="flex-end"
                    style={{
                        border: "1px solid #E5E7EB",
                        borderRadius: "8px",
                        padding: "8px",
                    }}
                >
                    <Text>{doc.name}</Text>
                    <ActionIcon
                        color="red"
                        variant="subtle"
                        size="lg"
                        onClick={() => handleRemove(index)}
                    >
                        <IconTrash size={16} />
                    </ActionIcon>
                </Group>
            ))}
            <RelatedDocumentModal onAdd={handleAdd} />
            <Button
                variant="light"
                onClick={() => openModal("relatedDocumentModal")}
                leftSection={<IconPlus size={14} />}
            >
                Add Related Document
            </Button>
        </Stack>
    );
};

export default RelatedFilesInput;
