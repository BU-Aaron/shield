import { FormEventHandler } from "react";
import { useForm } from "@inertiajs/react";
import { notifications } from "@mantine/notifications";
import useModalStore from "@/Modules/Common/Hooks/use-modal-store";
import { RestoreTrashedItemsData } from "@/Modules/Trash/Types/RestoreTrashedItemsData";

export function useRestoreFiles() {
    const { closeModal } = useModalStore();

    const { data, post, processing } = useForm<RestoreTrashedItemsData>({
        ids: [],
    });

    const restoreFilesSubmit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route("trash.restore"), {
            onSuccess: () => {
                closeModal("restoreFiles");
                notifications.show({
                    position: "top-center",
                    message: "Files restored successfully",
                    color: "green",
                });
            },
            onError: (errors) => {
                let message = "";

                if (Object.keys(errors).length > 0) {
                    message = errors[Object.keys(errors)[0]];
                } else {
                    message =
                        "Error during file restoration. Please try again later.";
                }

                notifications.show({
                    position: "top-center",
                    message,
                    color: "red",
                });
            },
        });
    };

    return {
        data,
        setData: (newData: Partial<RestoreTrashedItemsData>) => {
            // Assuming setData is needed; if useForm provides setData, adjust accordingly
            Object.assign(data, newData);
        },
        restoreFilesSubmit,
        processing,
    };
}
