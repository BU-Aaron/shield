import { useForm } from "@inertiajs/react";
import { notifications } from "@mantine/notifications";

interface UseDeleteWorkflowProps {
    workflowId?: number;
    onDeleteSuccess: () => void;
}

export function useDeleteWorkflow({
    workflowId,
    onDeleteSuccess,
}: UseDeleteWorkflowProps) {
    const { delete: destroy, processing } = useForm();

    const handleDeleteWorkflow = () => {
        if (!workflowId) {
            notifications.show({
                position: "top-center",
                message: "Workflow ID is missing.",
                color: "red",
            });
            return;
        }

        destroy(route("workflows.destroy", workflowId), {
            preserveScroll: true,
            onSuccess: () => {
                notifications.show({
                    position: "top-center",
                    message: "Workflow deleted successfully.",
                    color: "green",
                });
                onDeleteSuccess();
            },
            onError: (errors) => {
                let message = "Failed to delete workflow.";
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

    return { handleDeleteWorkflow, processing };
}
