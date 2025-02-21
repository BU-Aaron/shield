import { useEffect, useState } from "react";
import axios from "axios";
import { UserResourceData } from "@/Modules/User/Types/UserResourceData";
import { notifications } from "@mantine/notifications";

export function useFetchUsers() {
    const [users, setUsers] = useState<UserResourceData[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            try {
                const response = await axios.get<UserResourceData[]>(
                    route("users.get-users")
                );
                setUsers(response.data);
                setError(null);
            } catch (err) {
                console.error(err);
                setError("Failed to fetch users.");
                notifications.show({
                    position: "top-center",
                    title: "Error",
                    message: "Unable to fetch users.",
                    color: "red",
                });
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    return { users, loading, error };
}
