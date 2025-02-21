import { FormEventHandler } from "react";
import { useForm } from "@inertiajs/react";
import { notifications } from "@mantine/notifications";
import useModalStore from "@/Modules/Common/Hooks/use-modal-store";

interface ArchiveFilesData {
    ids: string[];
}

interface UseArchiveFilesProps {
    selectedIds: string[];
    setSelectedRecord: (record: any[]) => void;
}

export function useArchiveFiles({
    selectedIds,
    setSelectedRecord,
}: UseArchiveFilesProps) {
    const { closeModal } = useModalStore();

    const { data, post, processing } = useForm<ArchiveFilesData>({
        ids: selectedIds,
    });

    const archiveFilesSubmit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route("item.archive"), {
            onSuccess: () => {
                closeModal("archiveFiles");
                setSelectedRecord([]);
                notifications.show({
                    position: "top-center",
                    message: "Files archived successfully",
                    color: "green",
                });
            },
            onError: (errors) => {
                let message = "";

                if (Object.keys(errors).length > 0) {
                    message = errors[Object.keys(errors)[0]];
                } else {
                    message = "Error during archiving. Please try again later.";
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
        setData: (newData: Partial<ArchiveFilesData>) => {
            // Assuming setData is needed; if useForm provides setData, adjust accordingly
            Object.assign(data, newData);
        },
        archiveFilesSubmit,
        processing,
    };
}
