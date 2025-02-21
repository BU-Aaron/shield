import { FormEventHandler } from "react";
import { useForm } from "@inertiajs/react";
import { notifications } from "@mantine/notifications";
import useModalStore from "@/Modules/Common/Hooks/use-modal-store";

interface UnarchiveFilesData {
    ids: string[];
}

interface UseUnarchiveFilesProps {
    restoreIds: string[];
}

export function useUnarchiveFiles({ restoreIds }: UseUnarchiveFilesProps) {
    const { closeModal } = useModalStore();

    const { data, post, processing } = useForm<UnarchiveFilesData>({
        ids: restoreIds,
    });

    const unarchiveFilesSubmit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route("archive.unarchive"), {
            onSuccess: () => {
                closeModal("unarchiveFiles");
                notifications.show({
                    position: "top-center",
                    message: "Files unarchived successfully",
                    color: "green",
                });
            },
            onError: (errors) => {
                let message = "";

                if (Object.keys(errors).length > 0) {
                    message = errors[Object.keys(errors)[0]];
                } else {
                    message =
                        "Error during unarchiving. Please try again later.";
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
        setData: (newData: Partial<UnarchiveFilesData>) => {
            Object.assign(data, newData);
        },
        unarchiveFilesSubmit,
        processing,
    };
}
