import { useEffect, useState } from "react";
import axios from "axios";
import { notifications } from "@mantine/notifications";

interface ArchiveFrequency {
    years: number;
    enabled: boolean;
}

export function useFetchArchiveFrequency(isOpen: boolean) {
    const [frequency, setFrequency] = useState<ArchiveFrequency | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            setLoading(true);
            axios
                .get(route("archive.frequency.getYears"))
                .then((response) => {
                    setFrequency(response.data);
                    setLoading(false);
                })
                .catch((err) => {
                    setError("Failed to fetch archive frequency.");
                    notifications.show({
                        message: "Failed to fetch archive frequency.",
                        color: "red",
                        position: "top-center",
                    });
                    setLoading(false);
                });
        }
    }, [isOpen]);

    return { frequency, loading, error };
}
