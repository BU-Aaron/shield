import { useForm } from "@inertiajs/react";
import { notifications } from "@mantine/notifications";
import { ShareFolderData, ShareFolderUserData } from "../Types/ShareFolderData";
import { useEffect } from "react";
import { useFetchUsersShareFolder } from "./use-fetch-users-share-folder";
import useModalStore from "@/Modules/Common/Hooks/use-modal-store";

interface UseShareFolderProps {
    folderId: string;
    close: () => void;
}

export function useShareFolder({ folderId, close }: UseShareFolderProps) {
    const { modals } = useModalStore();
    const isOpen = modals["shareFolder"];
    const { sharedUsers, loading, error } = useFetchUsersShareFolder({
        folderId,
        isOpen,
    });

    const { data, setData, post, processing, errors, reset } =
        useForm<ShareFolderData>({
            users: [],
        });

    useEffect(() => {
        if (sharedUsers.length > 0) {
            const initialUsers: ShareFolderUserData[] = sharedUsers.map(
                (user) => ({
                    email: user.email,
                    role: user.role,
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
        field: keyof ShareFolderUserData,
        value: string
    ) => {
        const updatedUsers = data.users.map((user, i) =>
            i === index ? { ...user, [field]: value } : user
        );
        setData("users", updatedUsers);
    };

    const handleAddAllUsers = () => {
        // This function can be enhanced to set the role if needed
        const allUsers = sharedUsers.map((user) => ({
            email: user.email,
            role: "viewer" as const,
        }));
        setData("users", allUsers);
    };

    const submitShare = () => {
        post(route("folder.share", { folder: folderId }), {
            onSuccess: () => {
                close();
                notifications.show({
                    position: "top-center",
                    message: "Folder shared successfully.",
                    color: "green",
                });
                reset();
            },
            onError: (errors) => {
                notifications.show({
                    position: "top-center",
                    message: "Failed to share the folder.",
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
