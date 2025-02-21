import { useEffect } from "react";
import { useForm } from "@inertiajs/react";
import { notifications } from "@mantine/notifications";
import {
    MetadataResourceData,
    MetadataPredefinedValue,
} from "../Types/MetadataResourceData";
import { UpdateMetadataData } from "../Types/UpdateMetadataData";

interface IProps {
    metadata?: MetadataResourceData;
    close: () => void;
}

export function useUpdateMetadata({ metadata, close }: IProps) {
    const { data, setData, patch, processing, errors, reset } =
        useForm<UpdateMetadataData>({
            name: "",
            type: "",
            predefined_values: [],
        });

    useEffect(() => {
        if (metadata) {
            setData({
                name: metadata.name,
                type: metadata.type,
                predefined_values: metadata.predefined_values.map((val) => ({
                    id: val.id,
                    predefined_value: val.predefined_value,
                })),
            });
        }
    }, [metadata]);

    const handleEdit = (e: React.FormEvent) => {
        e.preventDefault();

        // Extract predefined values
        const predefinedValues = data.predefined_values
            ?.filter((val) => val.predefined_value.trim() !== "")
            .map((val) => val.predefined_value.trim());

        patch(route("metadata.update", metadata?.metadata_id), {
            data: {
                name: data.name,
                type: data.type,
                predefined_values: predefinedValues,
            },
            onSuccess: () => {
                close();
                notifications.show({
                    position: "top-center",
                    message: "Metadata edited successfully",
                    color: "green",
                });
            },
            // onFinish: () => reset(),
        });
    };

    return { data, setData, handleEdit, processing, errors };
}
