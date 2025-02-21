import { useForm } from "@inertiajs/react";
import { notifications } from "@mantine/notifications";
import { DeleteTrashedItemsData } from "@/Modules/Trash/Types/DeleteTrashedItemsData";
import useModalStore from "@/Modules/Common/Hooks/use-modal-store";

interface UsePermanentDeleteProps {
    deleteIds?: string[];
}

export function usePermanentDelete({ deleteIds }: UsePermanentDeleteProps) {
    const {
        data,
        delete: destroy,
        processing,
    } = useForm<DeleteTrashedItemsData>({
        ids: [],
    });

    const { closeModal } = useModalStore();

    const deleteFilesSubmit: React.FormEventHandler = (e) => {
        e.preventDefault();

        data.ids = deleteIds || [];

        destroy(route("trash.delete"), {
            onSuccess: () => {
                closeModal("permanentDelete");
                notifications.show({
                    position: "top-center",
                    message: "Files deleted permanently",
                    color: "green",
                });
            },
            onError: (errors) => {
                let message = "";

                if (Object.keys(errors).length > 0) {
                    message = errors[Object.keys(errors)[0]];
                } else {
                    message =
                        "Error during file deletion. Please try again later.";
                }

                notifications.show({
                    position: "top-center",
                    message,
                    color: "red",
                });
            },
        });
    };

    return { deleteFilesSubmit, processing };
}
