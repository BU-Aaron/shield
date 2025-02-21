import { useForm } from "@inertiajs/react";
import { notifications } from "@mantine/notifications";
import useModalStore from "@/Modules/Common/Hooks/use-modal-store";

interface UseDeleteNumberingSchemeProps {
    numberingSchemeId?: number;
    onDeleteSuccess: () => void;
}

export function useDeleteNumberingScheme({
    numberingSchemeId,
    onDeleteSuccess,
}: UseDeleteNumberingSchemeProps) {
    const { delete: destroy, processing } = useForm();

    const handleDeleteNumberingScheme = () => {
        if (!numberingSchemeId) {
            notifications.show({
                position: "top-center",
                message: "Numbering Scheme ID is missing.",
                color: "red",
            });
            return;
        }

        destroy(route("numbering-scheme.destroy", numberingSchemeId), {
            onSuccess: () => {
                notifications.show({
                    position: "top-center",
                    message: "Numbering Scheme deleted successfully.",
                    color: "green",
                });
                onDeleteSuccess();
            },
            onError: (errors) => {
                let message = "Failed to delete numbering scheme.";
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

    return { handleDeleteNumberingScheme, processing };
}
