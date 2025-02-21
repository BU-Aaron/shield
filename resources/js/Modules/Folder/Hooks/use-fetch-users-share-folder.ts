import { useEffect, useState } from "react";
import axios from "axios";
import { UserResourceData } from "@/Modules/User/Types/UserResourceData";
import { notifications } from "@mantine/notifications";
import { ShareFolderUserResource } from "../Types/ShareFolderUserResource";

interface UseFetchUsersShareFolderProps {
    folderId: string;
    isOpen: boolean;
}

export function useFetchUsersShareFolder({
    folderId,
    isOpen,
}: UseFetchUsersShareFolderProps) {
    const [sharedUsers, setSharedUsers] = useState<ShareFolderUserResource[]>(
        []
    );
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSharedUsers = async () => {
            setLoading(true);
            try {
                const response = await axios.get<ShareFolderUserResource[]>(
                    route("folder.fetchSharedUsers", { folder: folderId })
                );
                setSharedUsers(response.data);
                setError(null);
            } catch (err) {
                console.error(err);
                setError("Failed to fetch shared users.");
                notifications.show({
                    position: "top-center",
                    title: "Error",
                    message: "Unable to fetch shared users.",
                    color: "red",
                });
            } finally {
                setLoading(false);
            }
        };

        if (folderId) {
            fetchSharedUsers();
        }
    }, [folderId, isOpen]);

    return { sharedUsers, loading, error };
}
