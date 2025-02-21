import { useEffect, useState } from "react";
import axios from "axios";
import { UserResourceData } from "@/Modules/User/Types/UserResourceData";
import { notifications } from "@mantine/notifications";
import { ShareDocumentUserResource } from "../Types/ShareDocumentUserResource";

interface UseFetchUsersShareDocumentProps {
    documentId: string;
    isOpen: boolean;
}

export function useFetchUsersShareDocument({
    documentId,
    isOpen,
}: UseFetchUsersShareDocumentProps) {
    const [sharedUsers, setSharedUsers] = useState<ShareDocumentUserResource[]>(
        []
    );
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSharedUsers = async () => {
            setLoading(true);
            try {
                const response = await axios.get<ShareDocumentUserResource[]>(
                    route("document.fetchSharedUsers", { document: documentId })
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

        if (documentId) {
            fetchSharedUsers();
        }
    }, [documentId, isOpen]);

    return { sharedUsers, loading, error };
}
