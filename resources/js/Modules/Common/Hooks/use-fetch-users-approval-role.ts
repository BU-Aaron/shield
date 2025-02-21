import axios from "axios";
import { useState, useEffect } from "react";
import { UserResourceData } from "@/Modules/User/Types/UserResourceData";

export function useFetchUsersApprovalRole(approvalType: string, isOpen: boolean) {
    const [users, setUsers] = useState<UserResourceData[]>([]);

    useEffect(() => {
        if (approvalType && isOpen) {
            fetchUsers(approvalType);
        }
    }, [approvalType, isOpen]);

    const fetchUsers = async (type: string) => {
        try {
            const response = await axios.get(`/users/get-users-approval-role/${type}`);
            setUsers(response.data);
        } catch (error) {
            console.error("Error fetching users", error);
        }
    };

    return users;
}