import { useForm } from "@inertiajs/react";
import { notifications } from "@mantine/notifications";
import { FileWithPath } from "@mantine/dropzone";
import { UploadDocumentVersionData } from "../Types/UploadDocumentVersionData";

export default function useUploadDocumentVersion(documentItemId: string) {
    const { data, post, reset, processing, errors, clearErrors } =
        useForm<UploadDocumentVersionData>({
            document_item_id: documentItemId,
            file: null,
        });

    const uploadVersion = (file: FileWithPath) => {
        if (!file) {
            notifications.show({
                position: "top-center",
                message: "No file selected.",
                color: "red",
            });
            return;
        }

        data.file = file;

        post(`/document/${documentItemId}/versions`, {
            onSuccess: () => {
                notifications.show({
                    position: "top-center",
                    message: "Document version uploaded successfully.",
                    color: "green",
                });
                reset();
            },
            onError: () => {
                notifications.show({
                    position: "top-center",
                    message: "Failed to upload document version.",
                    color: "red",
                });
            },
            onFinish: () => {
                clearErrors();
            },
        });
    };

    return { uploadVersion, processing, errors };
}
