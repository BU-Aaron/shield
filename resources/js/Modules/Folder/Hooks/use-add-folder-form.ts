import { useForm } from "@inertiajs/react";
import { CreateFolderFormData } from "../Types/CreateFolderFormData";
import { notifications } from "@mantine/notifications";
import { ItemParentResourceData } from "@/Modules/Item/Types/ItemParentResourceData";
import useModalStore from "@/Modules/Common/Hooks/use-modal-store";

interface IProps {
    itemParent?: ItemParentResourceData;
    close: () => void;
}

export function useAddFolder({ itemParent, close }: IProps) {
    const { data, setData, post, processing, errors, reset, clearErrors } =
        useForm<CreateFolderFormData>({
            parent_id: "",
            name: "",
        });
    const { closeModal } = useModalStore();

    const submit = (e: React.FormEvent) => {
        data.parent_id = itemParent?.item_id || "";
        e.preventDefault();

        post(route("folder.create"), {
            preserveScroll: true,
            onSuccess: () => {
                notifications.show({
                    position: "top-center",
                    message: "New folder created",
                    color: "green",
                });
            },
            onError: (errors) => {
                let message = "";

                if (Object.keys(errors).length > 0) {
                    message = errors[Object.keys(errors)[0]];
                } else {
                    message =
                        "Error during file upload. Please try again later.";
                }

                notifications.show({
                    position: "top-center",
                    message,
                    color: "red",
                });
            },
            onFinish: () => {
                closeModal("folder");
                reset();
                clearErrors();
            },
        });
    };

    return { data, setData, submit, processing, errors };
}
