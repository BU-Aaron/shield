import React, { useState } from "react";
import { Group, ActionIcon, TextInput, Button, Stack } from "@mantine/core";
import { IconPlus, IconTrash } from "@tabler/icons-react";

interface RelatedDocument {
    item_id: string;
    name: string;
}

interface RelatedDocumentsInputProps {
    relatedDocuments: RelatedDocument[];
    onChange?: (relatedDocuments: RelatedDocument[]) => void;
}

const RelatedDocumentsInput: React.FC<RelatedDocumentsInputProps> = ({ relatedDocuments: initialDocuments, onChange }) => {
    const [documents, setDocuments] = useState<RelatedDocument[]>(initialDocuments);

    const handleAdd = () => {
        setDocuments([...documents, { item_id: "", name: "" }]);
    };

    const handleRemove = (index: number) => {
        const newDocuments = documents.filter((_, i) => i !== index);
        setDocuments(newDocuments);
        if (onChange) onChange(newDocuments);
    };

    const handleChange = (index: number, field: keyof RelatedDocument, value: string) => {
        const newDocuments = documents.map((doc, i) => (i === index ? { ...doc, [field]: value } : doc));
        setDocuments(newDocuments);
        if (onChange) onChange(newDocuments);
    };

    return (
        <Stack>
            {documents.map((doc, index) => (
                <Group key={index} grow align="flex-end">
                    <TextInput
                        label="Item ID"
                        placeholder="Item ID"
                        value={doc.item_id}
                        onChange={(e) => handleChange(index, "item_id", e.target.value)}
                        required
                    />
                    <TextInput
                        label="Name"
                        placeholder="Document name"
                        value={doc.name}
                        onChange={(e) => handleChange(index, "name", e.target.value)}
                        required
                    />
                    <ActionIcon color="red" onClick={() => handleRemove(index)}>
                        <IconTrash size={16} />
                    </ActionIcon>
                </Group>
            ))}
            <Button variant="light" onClick={handleAdd} leftSection={<IconPlus size={14} />}>
                Add Related Document
            </Button>
        </Stack>
    );
};

export default RelatedDocumentsInput;