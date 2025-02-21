import { Button, Modal, Stack, Group, InputBase, Combobox, useCombobox } from "@mantine/core";
import { useState } from "react";
import useModalStore from "@/Modules/Common/Hooks/use-modal-store";
import useFetchMetadata from "@/Modules/Metadata/Hooks/use-fetch-metadata";

interface AddRequiredMetadataModalProps {
    folderId: string;
    onAdd: (metadataId: number) => void;
}

const AddRequiredMetadataModal: React.FC<AddRequiredMetadataModalProps> = ({ folderId, onAdd }) => {
    const { modals, closeModal } = useModalStore();
    const [selectedMetadata, setSelectedMetadata] = useState<number | null>(null);
    const { metadataList } = useFetchMetadata();
    const combobox = useCombobox({
        onDropdownClose: () => combobox.resetSelectedOption(),
    });

    const handleAdd = () => {
        if (selectedMetadata) {
            onAdd(selectedMetadata);
            closeModal("addRequiredMetadata");
            setSelectedMetadata(null);
        }
    };

    const options = metadataList.map((meta) => (
        <Combobox.Option value={meta.metadata_id.toString()} key={meta.metadata_id}>
            {meta.name}
        </Combobox.Option>
    ));

    return (
        <Modal opened={modals["addRequiredMetadata"]} onClose={() => closeModal("addRequiredMetadata")} title="Add Required Metadata">
            <Stack gap={16}>
                <Combobox
                    store={combobox}
                    onOptionSubmit={(val) => {
                        setSelectedMetadata(parseInt(val));
                        combobox.closeDropdown();
                    }}
                >
                    <Combobox.Target>
                        <InputBase
                            component="button"
                            type="button"
                            pointer
                            rightSection={<Combobox.Chevron />}
                            rightSectionPointerEvents="none"
                            onClick={() => combobox.toggleDropdown()}
                        >
                            {selectedMetadata ? metadataList.find(meta => meta.metadata_id === selectedMetadata)?.name : "Select Metadata"}
                        </InputBase>
                    </Combobox.Target>

                    <Combobox.Dropdown>
                        <Combobox.Options>{options}</Combobox.Options>
                    </Combobox.Dropdown>
                </Combobox>

                <Group justify="flex-end">
                    <Button variant="outline" onClick={() => closeModal("addRequiredMetadata")}>
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

export default AddRequiredMetadataModal;
