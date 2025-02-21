import { useForm } from "@inertiajs/react";
import { notifications } from "@mantine/notifications";
import { FileWithPath } from "@mantine/dropzone";
import { UploadDocumentData } from "../Types/UploadDocumentData";
import { ItemParentResourceData } from "@/Modules/Item/Types/ItemParentResourceData";
import { IconCheck } from "@tabler/icons-react";
import React from "react";

export function useUploadDocument(itemParent: ItemParentResourceData) {
    const { data, post, reset, clearErrors } = useForm<UploadDocumentData>({
        parent_id: "",
        files: [],
    });

    const uploadFiles = (files: FileWithPath[]) => {
        data.parent_id = itemParent.item_id;
        data.files = files.map((file) => ({ file }));

        post(route("document.store"), {
            onSuccess: () => {
                notifications.show({
                    position: "top-center",
                    message: "Document uploaded",
                    color: "green",
                    icon: React.createElement(IconCheck),
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
                reset();
                clearErrors();
            },
        });
    };

    return { uploadFiles };
}
