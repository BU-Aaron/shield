import { useForm } from "@inertiajs/react";
import { notifications } from "@mantine/notifications";
import { CreateMetadataData } from "../Types/CreateMetadataData";

interface IProps {
    close: () => void;
}

export function useCreateMetadata({ close }: IProps) {
    const { data, setData, post, processing, errors, reset, clearErrors } =
        useForm<CreateMetadataData>({
            name: "",
            type: "",
        });

    const handleClose = () => {
        close();
        reset();
        clearErrors();
    };

    const handleCreateMetadata = (e: React.FormEvent) => {
        e.preventDefault();

        post(route("metadata.store"), {
            onSuccess: () => {
                handleClose();
                notifications.show({
                    position: "top-center",
                    message: "New metadata added successfully",
                    color: "green",
                });
            },
            onFinish: () => reset(),
        });
    };

    return {
        data,
        setData,
        handleCreateMetadata,
        processing,
        errors,
        handleClose,
    };
}
