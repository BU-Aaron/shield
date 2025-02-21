import { Button, Flex, Modal, Text } from "@mantine/core";
import useModalStore from "@/Modules/Common/Hooks/use-modal-store";
import { useDeleteDocumentApproval } from "../Hooks/use-delete-document-approval";
import { useDeleteDocumentReview } from "../Hooks/use-delete-document-review";

interface ConfirmDeleteDocumentReviewProps {
    documentReviewId?: string;
}

const ConfirmDeleteDocumentReviewForm: React.FC<
    ConfirmDeleteDocumentReviewProps
> = ({ documentReviewId }) => {
    const { modals, closeModal, openModal } = useModalStore();
    const isOpen = modals["confirmDeleteDocumentReview"];

    const { handleDeleteDocumentReview, processing } = useDeleteDocumentReview({
        documentReviewId,
        onDeleteSuccess: () => {
            closeModal("confirmDeleteDocumentReview");
            closeModal("viewDocumentReview");
        },
    });

    return (
        <Modal
            opened={isOpen}
            onClose={() => closeModal("confirmDeleteDocumentReview")}
            title={
                <Text fw="bold" size="lg">
                    Confirm Delete
                </Text>
            }
            size="sm"
            centered
        >
            <Text c="gray.8">
                Are you sure you want to cancel this document review? This
                action cannot be undone.
            </Text>
            <Flex align="center" justify="flex-end" mt={16}>
                <Button
                    variant="light"
                    onClick={() => {
                        closeModal("confirmDeleteDocumentReview");
                        openModal("viewDocumentReview");
                    }}
                >
                    Cancel
                </Button>
                <Button
                    color="red"
                    ml={12}
                    onClick={handleDeleteDocumentReview}
                    loading={processing}
                >
                    Delete
                </Button>
            </Flex>
        </Modal>
    );
};

export default ConfirmDeleteDocumentReviewForm;
