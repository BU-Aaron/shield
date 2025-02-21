import React, { useState } from "react";
import { Modal, Text, Group, InputBase, Button, Stack, useCombobox } from "@mantine/core";
import { Combobox } from "@mantine/core";
import useModalStore from "@/Modules/Common/Hooks/use-modal-store";
import useFetchMetadata from "@/Modules/Metadata/Hooks/use-fetch-metadata";
import { FolderRequiredMetadataResource } from "@/Modules/Folder/Types/FolderRequiredMetadataResource";

interface AddDocumentMetadataModalProps {
    onAdd: (metadata: FolderRequiredMetadataResource) => void;
}

const AddDocumentMetadataModal: React.FC<AddDocumentMetadataModalProps> = ({ onAdd }) => {
    const { modals, closeModal } = useModalStore();
    const isOpen = modals["addDocumentMetadata"];
    const { metadataList } = useFetchMetadata();
    const [selectedMetadata, setSelectedMetadata] = useState<FolderRequiredMetadataResource | null>(null);

    const combobox = useCombobox({
        onDropdownClose: () => combobox.resetSelectedOption(),
    });

    const handleAdd = () => {
        if (selectedMetadata) {
            onAdd(selectedMetadata);
            closeModal("addDocumentMetadata");
            setSelectedMetadata(null);
        }
    };

    const options = metadataList.map(meta => (
        <Combobox.Option value={meta.metadata_id.toString()} key={meta.metadata_id}>
            {meta.name}
        </Combobox.Option>
    ));

    return (
        <Modal
            opened={isOpen}
            onClose={() => closeModal("addDocumentMetadata")}
            title="Add Custom Metadata"
        >
            <Stack gap={16}>
                <Combobox
                    store={combobox}
                    onOptionSubmit={(val) => {
                        const selected = metadataList.find(meta => meta.metadata_id.toString() === val) || null;
                        setSelectedMetadata(selected);
                        combobox.closeDropdown();
                    }}
                >
                    <Combobox.Target>
                        <InputBase
                            component="button"
                            type="button"
                            rightSection={<Combobox.Chevron />}
                            onClick={() => combobox.toggleDropdown()}
                        >
                            {selectedMetadata ? selectedMetadata.name : "Select Metadata"}
                        </InputBase>
                    </Combobox.Target>
                    <Combobox.Dropdown>
                        <Combobox.Options>{options}</Combobox.Options>
                    </Combobox.Dropdown>
                </Combobox>
                <Group justify="flex-end">
                    <Button variant="outline" onClick={() => closeModal("addDocumentMetadata")}>
                        Cancel
                    </Button>
                    <Button onClick={handleAdd} disabled={!selectedMetadata}>
                        Add
                    </Button>
                </Group>
            </Stack>
        </Modal>
    );
};

export default AddDocumentMetadataModal;