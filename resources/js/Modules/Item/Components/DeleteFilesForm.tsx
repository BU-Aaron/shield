import React from "react";
import { Button, Flex, Modal, Text } from "@mantine/core";
import { useDeleteFiles } from "@/Modules/Common/Hooks/use-delete-files";
import useModalStore from "@/Modules/Common/Hooks/use-modal-store";
interface DeleteFilesFormProps {
    selectedIds: string[];
    setSelectedRecord: (record: any[]) => void;
}

const DeleteFilesForm: React.FC<DeleteFilesFormProps> = ({
    selectedIds,
    setSelectedRecord,
}) => {
    const { handleDelete, processing } = useDeleteFiles({ setSelectedRecord });
    const { modals, closeModal } = useModalStore();

    return (
        <Modal
            opened={modals["deleteFiles"]}
            onClose={() => closeModal("deleteFiles")}
            title={
                <Text fw="bold" size="lg">
                    Delete Files
                </Text>
            }
            size={550}
        >
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    handleDelete(selectedIds);
                }}
            >
                <Text c="dimmed">Delete selected files?</Text>
                <Flex align="center" justify="end" mt={16}>
                    <Button
                        variant="subtle"
                        onClick={() => closeModal("deleteFiles")}
                        color="gray"
                    >
                        Cancel
                    </Button>
                    <Button
                        ml={12}
                        type="submit"
                        loading={processing}
                        color="red"
                    >
                        Delete
                    </Button>
                </Flex>
            </form>
        </Modal>
    );
};

export default DeleteFilesForm;
