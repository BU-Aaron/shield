import { Button, Flex, Modal, Text } from "@mantine/core";
import { useDeleteWorkflow } from "../Hooks/use-delete-workflow";
import useModalStore from "@/Modules/Common/Hooks/use-modal-store";

interface ConfirmDeleteWorkflowProps {
    workflowId?: number;

}

const ConfirmDeleteWorkflowForm: React.FC<ConfirmDeleteWorkflowProps> = ({ workflowId }) => {
    const { modals, closeModal, openModal } = useModalStore();
    const isOpen = modals["confirmDeleteWorkflow"];

    const { handleDeleteWorkflow, processing } = useDeleteWorkflow({
        workflowId,
        onDeleteSuccess: () => {
            closeModal("confirmDeleteWorkflow");
            closeModal("updateWorkflow");
        },
    });

    return (
        <Modal
            opened={isOpen}
            onClose={() => closeModal("confirmDeleteWorkflow")}
            title={<Text fw="bold" size="lg">Confirm Delete</Text>}
            size="sm"
            centered
        >
            <Text c="gray.8">Are you sure you want to delete this workflow? This action cannot be undone.</Text>
            <Flex align="center" justify="flex-end" mt={16}>
                <Button variant="light" onClick={() => {
                    closeModal("confirmDeleteWorkflow");
                    openModal("updateWorkflow");
                }}>
                    Cancel
                </Button>
                <Button
                    color="red"
                    ml={12}
                    onClick={handleDeleteWorkflow}
                    loading={processing}
                >
                    Delete
                </Button>
            </Flex>
        </Modal>
    );
};

export default ConfirmDeleteWorkflowForm;