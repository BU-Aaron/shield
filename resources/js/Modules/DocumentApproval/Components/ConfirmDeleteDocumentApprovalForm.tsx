import { Button, Flex, Modal, Text } from "@mantine/core";
import useModalStore from "@/Modules/Common/Hooks/use-modal-store";
import { useDeleteDocumentApproval } from "../Hooks/use-delete-document-approval";

interface ConfirmDeleteDocumentApprovalProps {
    documentApprovalId?: string;
}

const ConfirmDeleteDocumentApprovalForm: React.FC<ConfirmDeleteDocumentApprovalProps> = ({ documentApprovalId }) => {
    const { modals, closeModal, openModal } = useModalStore();
    const isOpen = modals["confirmDeleteDocumentApproval"];

    const { handleDeleteDocumentApproval, processing } = useDeleteDocumentApproval({
        documentApprovalId,
        onDeleteSuccess: () => {
            closeModal("confirmDeleteDocumentApproval");
            closeModal("viewDocumentApproval");
        },
    });

    return (
        <Modal
            opened={isOpen}
            onClose={() => closeModal("confirmDeleteDocumentApproval")}
            title={<Text fw="bold" size="lg">Confirm Delete</Text>}
            size="sm"
            centered
        >
            <Text c="gray.8">Are you sure you want to cancel this document approval? This action cannot be undone.</Text>
            <Flex align="center" justify="flex-end" mt={16}>
                <Button variant="light" onClick={() => {
                    closeModal("confirmDeleteDocumentApproval");
                    openModal("viewDocumentApproval");
                }}>
                    Cancel
                </Button>
                <Button
                    color="red"
                    ml={12}
                    onClick={handleDeleteDocumentApproval}
                    loading={processing}
                >
                    Delete
                </Button>
            </Flex>
        </Modal>
    );
};

export default ConfirmDeleteDocumentApprovalForm; 