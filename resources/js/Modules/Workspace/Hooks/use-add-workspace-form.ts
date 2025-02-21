import { useForm } from "@inertiajs/react";
import { CreateWorkspaceFormData } from "../Types/CreateWorkspaceFormData";
import { notifications } from "@mantine/notifications";
import useModalStore from "@/Modules/Common/Hooks/use-modal-store";

export function useAddWorkspace() {
    const { data, setData, post, processing, errors, reset, clearErrors } =
        useForm<CreateWorkspaceFormData>({
            name: "",
        });

    const { closeModal } = useModalStore();

    const handleClose = () => {
        closeModal("workspace");
        reset();
        clearErrors();
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("workspace.store"), {
            onSuccess: () => {
                handleClose();
                notifications.show({
                    position: "top-center",
                    message: "New workspace added successfully",
                    color: "green",
                });
            },
            onFinish: () => reset(),
        });
    };

    return { data, setData, submit, processing, errors };
}
