import { useForm } from "@inertiajs/react";
import { notifications } from "@mantine/notifications";
import useModalStore from "@/Modules/Common/Hooks/use-modal-store";

interface UseDeleteDocumentReviewProps {
    documentReviewId?: string;
    onDeleteSuccess: () => void;
}

export function useDeleteDocumentReview({
    documentReviewId,
    onDeleteSuccess,
}: UseDeleteDocumentReviewProps) {
    const { delete: destroy, processing } = useForm();

    const handleDeleteDocumentReview = () => {
        if (!documentReviewId) {
            notifications.show({
                position: "top-center",
                message: "Document Review ID is missing.",
                color: "red",
            });
            return;
        }

        destroy(route("document_approvals.cancel", documentReviewId), {
            onSuccess: () => {
                notifications.show({
                    position: "top-center",
                    message: "Document Review deleted successfully.",
                    color: "green",
                });
                onDeleteSuccess();
            },
            onError: (errors) => {
                let message = "Failed to delete document review.";
                if (errors && Object.keys(errors).length > 0) {
                    message = errors[Object.keys(errors)[0]] as string;
                }
                notifications.show({
                    position: "top-center",
                    message,
                    color: "red",
                });
            },
        });
    };

    return { handleDeleteDocumentReview, processing };
}
