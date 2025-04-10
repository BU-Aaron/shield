import { useForm } from "@inertiajs/react";
import { FolderResourceData } from "../Types/FolderResourceData";
import { notifications } from "@mantine/notifications";
import useModalStore from "@/Modules/Common/Hooks/use-modal-store";
import { ItemParentResourceData } from "@/Modules/Item/Types/ItemParentResourceData";
import { useEffect } from "react";

interface UseFolderPropertiesProps {
    itemParent?: ItemParentResourceData;
}

export function useFolderProperties({ itemParent }: UseFolderPropertiesProps) {
    const { closeModal } = useModalStore();

    const { data, setData, put, processing, errors, reset, clearErrors } =
        useForm({
            name: itemParent?.name || "",
            description: itemParent?.description || "",
            category: itemParent?.category || "",
        });

    useEffect(() => {
        setData("name", itemParent?.name || "");
        setData("description", itemParent?.description || "");
        setData("category", itemParent?.category || "");
    }, [itemParent]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        put(route("folder.update", { id: itemParent?.item_id || "" }), {
            preserveScroll: true,
            onSuccess: () => {
                notifications.show({
                    position: "top-center",
                    message: "Folder properties updated successfully.",
                    color: "green",
                });
                closeModal("folderProperties");
            },
            onError: () => {
                notifications.show({
                    position: "top-center",
                    message: "Failed to update folder properties.",
                    color: "red",
                });
            },
            onFinish: () => {
                reset();
                clearErrors();
            },
        });
    };

    return { data, setData, submit, processing, errors };
}
