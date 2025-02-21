import axios from "axios";
import { useState, useEffect } from "react";
import { UserResourceData } from "@/Modules/User/Types/UserResourceData";

export function useFetchWorkflowUsers(workflowType: string, isOpen: boolean) {
    const [users, setUsers] = useState<UserResourceData[]>([]);

    useEffect(() => {
        if (workflowType && isOpen) {
            fetchUsers(workflowType);
        }
    }, [workflowType, isOpen]);

    const fetchUsers = async (type: string) => {
        try {
            const response = await axios.get(`/workflows/get-workflow-users-by-type/${type}`);
            setUsers(response.data);
        } catch (error) {
            console.error("Error fetching users", error);
        }
    };

    return users;
}