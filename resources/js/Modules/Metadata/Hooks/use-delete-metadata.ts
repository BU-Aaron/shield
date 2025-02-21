import { useForm } from "@inertiajs/react";
import { notifications } from "@mantine/notifications";
import { MetadataResourceData } from "../Types/MetadataResourceData";

interface IProps {
    metadata?: MetadataResourceData;
    close: () => void;
}

export function useDeleteMetadata({ metadata, close }: IProps) {
    const { processing, delete: destroy, reset } = useForm();

    const handleDelete = (e: React.FormEvent) => {
        e.preventDefault();

        destroy(route("metadata.destroy", metadata?.metadata_id), {
            onSuccess: () => {
                close();
                notifications.show({
                    position: "top-center",
                    message: "Metadata deleted successfully",
                    color: "red",
                });
            },
            onError: () => {
                close();
                notifications.show({
                    position: "top-center",
                    message: "Something went wrong",
                    color: "red",
                });
            },
            onFinish: () => reset(),
        });
    };

    return { handleDelete, processing };
}
