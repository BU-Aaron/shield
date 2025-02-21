// resources/js/Modules/Dashboard/Hooks/useDashboardMetadata.ts
import { useForm } from "@inertiajs/react";
import { DashboardMetadataResourceData } from "../Types/DashboardMetadataResourceData";
import { notifications } from "@mantine/notifications";

interface UseDashboardMetadataProps {
    closeModal: () => void;
}

export function useDashboardMetadata({
    closeModal,
}: UseDashboardMetadataProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        metadata_ids: [] as number[],
    });

    const handleSubmit = () => {
        post(route("dashboard.selectMetadataColumn"), {
            onSuccess: () => {
                notifications.show({
                    position: "top-center",
                    title: "Success",
                    message: "Metadata columns updated successfully",
                    color: "green",
                });
                closeModal();
                reset();
            },
            onError: () => {
                notifications.show({
                    position: "top-center",
                    title: "Error",
                    message: "Failed to update metadata columns",
                    color: "red",
                });
            },
        });
    };

    return {
        data,
        setData,
        handleSubmit,
        processing,
        errors,
    };
}
