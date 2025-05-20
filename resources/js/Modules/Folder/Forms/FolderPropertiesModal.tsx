import {
    Button,
    Flex,
    Modal,
    Stack,
    TextInput,
    Text,
    Textarea,
    Select,
} from "@mantine/core";
import React from "react";
import { useFolderProperties } from "../Hooks/use-folder-properties";
import useModalStore from "@/Modules/Common/Hooks/use-modal-store";
import { ItemParentResourceData } from "@/Modules/Item/Types/ItemParentResourceData";

interface FolderPropertiesModalProps {
    itemParent?: ItemParentResourceData;
}

const FolderPropertiesModal: React.FC<FolderPropertiesModalProps> = ({
    itemParent,
}) => {
    const { data, setData, submit, processing, errors } = useFolderProperties({
        itemParent,
    });
    const { modals, closeModal } = useModalStore();

    return (
        <Modal
            opened={modals["folderProperties"]}
            onClose={() => closeModal("folderProperties")}
            title={
                <Text fw="bold" size="lg">
                    Folder Properties
                </Text>
            }
            size="550"
        >
            <form onSubmit={submit}>
                <Stack gap={16}>
                    <TextInput
                        label="Folder Name"
                        name="name"
                        value={data.name}
                        onChange={(e) => setData("name", e.target.value)}
                        error={errors.name}
                        required
                    />
                    <Select
                        label={
                            <>
                                Category
                                {data.category && (
                                    <Text size="xs" c="dimmed" mt={4}>
                                        Current category: <strong>{data.category}</strong>
                                    </Text>
                                )}
                            </>
                        }
                        placeholder="Select category"
                        name="category"
                        data={[
                            "INV",
                            "INQ",
                            "UI",
                            "Forensic Reports",
                            "Finance/Invest",
                            "Inventory Reports",
                        ]}
                        value={data.category ?? ""}
                        onChange={(value) => setData("category", value || "")}
                        error={errors.category}
                    />
                    <Textarea
                        label="Notes"
                        name="description"
                        value={data.description}
                        onChange={(e) => setData("description", e.target.value)}
                        error={errors.description}
                        autosize
                        minRows={4}
                    />
                </Stack>
                <Flex align="center" justify="end" mt={16}>
                    <Button
                        variant="outline"
                        onClick={() => closeModal("folderProperties")}
                    >
                        Cancel
                    </Button>
                    <Button ml={12} type="submit" loading={processing}>
                        Save
                    </Button>
                </Flex>
            </form>
        </Modal>
    );
};

export default FolderPropertiesModal;
