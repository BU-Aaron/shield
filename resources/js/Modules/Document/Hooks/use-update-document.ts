import { useForm } from "@inertiajs/react";
import { UpdateDocumentData } from "../Types/UpdateDocumentData";
import { notifications } from "@mantine/notifications";
import { DocumentResourceData } from "@/Modules/Document/Types/DocumentResourceData";

interface UseUpdateDocumentProps {
    document: DocumentResourceData;
    onSuccess?: () => void;
}

export function useUpdateDocument({
    document,
    onSuccess,
}: UseUpdateDocumentProps) {
    const { data, setData, put, processing, errors, reset, clearErrors } =
        useForm<UpdateDocumentData>({
            name: document.name,
            document_number: document.document_number || "",
            description: document.description || "",
            due_date: document.due_date || "",
            update_metadata: document.metadata.map((meta) => ({
                metadata_id: meta.metadata_id,
                name: meta.name,
                value: meta.value,
            })),
            delete_metadata: [],
            related_documents: document.related_documents.map((doc) => ({
                item_id: doc.item_id,
                name: doc.name,
            })),
        });

    const handleUpdateDocument = (e: React.FormEvent) => {
        e.preventDefault();

        put(route("document.save", document.item_id), {
            onSuccess: () => {
                notifications.show({
                    position: "top-center",
                    message: "Document updated successfully",
                    color: "green",
                });
            },
            onError: (errors) => {
                notifications.show({
                    position: "top-center",
                    message: "Failed to update document",
                    color: "red",
                });
            },
            onFinish: () => clearErrors(),
        });
    };

    return {
        data,
        setData,
        handleUpdateDocument,
        processing,
        errors,
        reset,
    };
}
