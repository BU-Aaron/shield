import { useForm } from "@inertiajs/react";
import { notifications } from "@mantine/notifications";
import useModalStore from "@/Modules/Common/Hooks/use-modal-store";

interface UseDeleteDocumentApprovalProps {
    documentApprovalId?: string;
    onDeleteSuccess: () => void;
}

export function useDeleteDocumentApproval({
    documentApprovalId,
    onDeleteSuccess,
}: UseDeleteDocumentApprovalProps) {
    const { delete: destroy, processing } = useForm();

    const handleDeleteDocumentApproval = () => {
        if (!documentApprovalId) {
            notifications.show({
                position: "top-center",
                message: "Document Approval ID is missing.",
                color: "red",
            });
            return;
        }

        destroy(route("document_approvals.cancel", documentApprovalId), {
            onSuccess: () => {
                notifications.show({
                    position: "top-center",
                    message: "Document Approval deleted successfully.",
                    color: "green",
                });
                onDeleteSuccess();
            },
            onError: (errors) => {
                let message = "Failed to delete document approval.";
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

    return { handleDeleteDocumentApproval, processing };
}
