import axios from "axios";
import { useState, useEffect } from "react";
import { NotificationResource } from "../Data/NotificationResource";

export function useRetrieveNotification() {
    const [notifications, setNotifications] = useState<NotificationResource[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const response = await axios.get(route("notification.retrieveNotifications"));
            setNotifications(response.data.notifications);
        } catch (err) {
            setError("Failed to fetch notifications.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return { notifications, loading, error, fetchNotifications };
}