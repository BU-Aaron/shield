import React from "react";
import { Button, Flex, Modal, Text } from "@mantine/core";
import { usePermanentDelete } from "@/Modules/Trash/Hooks/use-permanent-delete";
import useModalStore from "@/Modules/Common/Hooks/use-modal-store";
interface PermanentDeleteModalProps {
    deleteIds?: string[];
}

const PermanentDeleteForm: React.FC<PermanentDeleteModalProps> = ({
    deleteIds,
}) => {
    const { deleteFilesSubmit, processing } = usePermanentDelete({ deleteIds });

    const { closeModal, modals } = useModalStore();
    return (
        <Modal
            opened={modals["permanentDelete"]}
            onClose={() => closeModal("permanentDelete")}
            title={
                <Text fw="bold" size="lg">
                    Delete Forever
                </Text>
            }
            size={550}
        >
            <form onSubmit={deleteFilesSubmit}>
                <Text c="dimmed">Permanently delete selected files?</Text>

                <Flex align="center" justify="end" mt={16}>
                    <Button variant="subtle" onClick={close} color="gray">
                        Cancel
                    </Button>

                    <Button
                        ml={12}
                        type="submit"
                        loading={processing}
                        color="red"
                    >
                        Confirm
                    </Button>
                </Flex>
            </form>
        </Modal>
    );
};

export default PermanentDeleteForm;