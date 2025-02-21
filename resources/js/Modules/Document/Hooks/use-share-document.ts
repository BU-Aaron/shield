import { useForm } from "@inertiajs/react";
import { notifications } from "@mantine/notifications";
import {
    ShareDocumentData,
    ShareDocumentUserData,
} from "../Types/ShareDocumentData";
import { useFetchUsersShareDocument } from "./use-fetch-users-share-document";
import useModalStore from "@/Modules/Common/Hooks/use-modal-store";
import { useEffect } from "react";

interface UseShareDocumentProps {
    documentId: string;
    close: () => void;
}

export function useShareDocument({ documentId, close }: UseShareDocumentProps) {
    const { modals } = useModalStore();
    const isOpen = modals["shareDocument"];
    const { sharedUsers, loading, error } = useFetchUsersShareDocument({
        documentId,
        isOpen,
    });

    const { data, setData, post, processing, errors, reset } =
        useForm<ShareDocumentData>({
            users: [],
        });

    useEffect(() => {
        if (sharedUsers.length > 0) {
            const initialUsers: ShareDocumentUserData[] = sharedUsers.map(
                (user) => ({
                    email: user.email,
                    role: user.role, //  Assuming default role; adjust if role information is available
                })
            );
            setData("users", initialUsers);
        }
    }, [sharedUsers]);

    const addUser = () => {
        setData("users", [...data.users, { email: "", role: "viewer" }]);
    };

    const removeUser = (index: number) => {
        const updatedUsers = data.users.filter((_, i) => i !== index);
        setData("users", updatedUsers);
    };

    const handleUserChange = (
        index: number,
        field: keyof ShareDocumentUserData,
        value: string
    ) => {
        const updatedUsers = data.users.map((user, i) =>
            i === index ? { ...user, [field]: value } : user
        );
        setData("users", updatedUsers);
    };

    const handleAddAllUsers = (allUsers: ShareDocumentUserData[]) => {
        setData("users", allUsers);
    };

    const submitShare = () => {
        post(route("document.share", { document: documentId }), {
            onSuccess: () => {
                close();
                notifications.show({
                    position: "top-center",
                    message: "Document shared successfully.",
                    color: "green",
                });
                reset();
            },
            onError: (errors) => {
                notifications.show({
                    position: "top-center",
                    message: "Failed to share the document.",
                    color: "red",
                });
            },
        });
    };

    return {
        data,
        submit: submitShare,
        processing,
        errors,
        addUser,
        removeUser,
        handleUserChange,
        handleAddAllUsers,
    };
}
