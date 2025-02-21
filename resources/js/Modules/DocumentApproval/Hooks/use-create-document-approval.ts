import { useState, FormEventHandler, useEffect } from "react";
import { useForm } from "@inertiajs/react";
import { notifications } from "@mantine/notifications";
import useModalStore from "@/Modules/Common/Hooks/use-modal-store";
import { useFetchUsersApprovalRole } from "@/Modules/Common/Hooks/use-fetch-users-approval-role";
import { CreateDocumentApprovalData } from "../Types/CreateDocumentApprovalData";

interface IProps {
    documentId?: string;
    isOpen: boolean;
}

interface UserOption {
    id: number;
    name: string;
    email: string;
}

interface DocumentApprovalUser {
    selectedUser: string;
}

export function useCreateDocumentApproval({ documentId, isOpen }: IProps) {
    const [documentApprovalType, setDocumentApprovalType] =
        useState("approval");
    const { closeModal, modals } = useModalStore();
    const fetchedUsers: UserOption[] = useFetchUsersApprovalRole(
        documentApprovalType,
        isOpen
    );

    const { data, setData, post, processing, errors, reset } =
        useForm<CreateDocumentApprovalData>({
            document_id: "",
            resolution: "",
            destination: "",
            type: "approval",
            users: [],
        });

    const [users, setUsers] = useState<DocumentApprovalUser[]>([]);
    const maxUsers = fetchedUsers.length;

    useEffect(() => {
        // Reset users when document approval type changes
        if (isOpen) {
            setUsers([]);
        }
    }, [documentApprovalType, fetchedUsers, isOpen]);

    const createApprovalSubmit: FormEventHandler = (e) => {
        e.preventDefault();

        const selectedUserIds = users
            .map((user) => parseInt(user.selectedUser))
            .filter((id) => !isNaN(id));

        data.document_id = documentId ?? "";
        data.users = selectedUserIds.map((id) => ({ user_id: id.toString() }));

        post(route("document_approvals.store"), {
            preserveScroll: true,
            onSuccess: () => {
                closeModal("createDocumentApproval");
                notifications.show({
                    position: "top-center",
                    message: "Document approval process created",
                    color: "green",
                });
            },
            onError: () => {
                notifications.show({
                    position: "top-center",
                    message: "Something went wrong",
                    color: "red",
                });
            },
            onFinish: () => reset(),
        });
    };

    const addUser = () => {
        if (users.length < maxUsers) {
            setUsers([
                ...users,
                {
                    selectedUser: "",
                },
            ]);
        }
    };

    const addAllUsers = () => {
        const selectedUserIds = users.map((user) => user.selectedUser);
        const availableUsers = fetchedUsers.filter(
            (u) => !selectedUserIds.includes(u.id.toString())
        );
        const newUsers = availableUsers.map((u) => ({
            selectedUser: u.id.toString(),
        }));
        setUsers([...users, ...newUsers]);
    };

    const removeUser = (index: number) => {
        const updatedUsers = [...users];
        updatedUsers.splice(index, 1);
        setUsers(updatedUsers);
    };

    const handleUserChange = (index: number, value: string | null) => {
        const updatedUsers = [...users];
        updatedUsers[index].selectedUser = value || "";
        setUsers(updatedUsers);
    };

    // Compute selected user IDs to exclude them from other Select options
    const selectedUserIds = users
        .map((user) => user.selectedUser)
        .filter((id) => id !== "");

    return {
        data,
        setData,
        createApprovalSubmit,
        processing,
        errors,
        users,
        setDocumentApprovalType,
        addUser,
        removeUser,
        handleUserChange,
        addAllUsers,
        maxUsers,
        selectedUserIds,
        fetchedUsers,
    };
}
