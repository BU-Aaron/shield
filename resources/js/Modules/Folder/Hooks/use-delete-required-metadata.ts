import { useForm } from "@inertiajs/react";
import { notifications } from "@mantine/notifications";

interface UseDeleteRequiredMetadataProps {
    folderId: string;
    metadataId: number;
    onDeleteSuccess: () => void;
}

export function useDeleteRequiredMetadata({
    folderId,
    metadataId,
    onDeleteSuccess,
}: UseDeleteRequiredMetadataProps) {
    const { delete: destroy, processing } = useForm();

    const handleDelete = () => {
        destroy(
            route("folder.deleteRequiredMetadata", {
                folder: folderId,
                metadata: metadataId,
            }),
            {
                onSuccess: () => {
                    notifications.show({
                        position: "top-center",
                        message: "Required Metadata deleted successfully.",
                        color: "green",
                    });
                    onDeleteSuccess();
                },
                onError: () => {
                    notifications.show({
                        position: "top-center",
                        message: "Failed to delete Required Metadata.",
                        color: "red",
                    });
                },
            }
        );
    };

    return { handleDelete, processing };
}
