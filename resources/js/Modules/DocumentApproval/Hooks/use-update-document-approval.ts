import { useForm } from "@inertiajs/react";
import { notifications } from "@mantine/notifications";
import { UpdateDocumentApprovalData } from "../Types/UpdateDocumentApprovalData";
import { useFetchUsersApprovalRole } from "@/Modules/Common/Hooks/use-fetch-users-approval-role";
import { useEffect, useState } from "react";
import { useFetchDocumentApproval } from "./use-fetch-document-approval";
import useModalStore from "@/Modules/Common/Hooks/use-modal-store";
import { DocumentUserApproval } from "../Types/DocumentApprovalResourceData";

interface IProps {
    documentApprovalId?: string;
    isOpen: boolean;
}

interface DocumentApprovalUser {
    selectedUser: string;
}

export function useUpdateDocumentApproval({
    documentApprovalId,
    isOpen,
}: IProps) {
    const [documentApprovalType, setDocumentApprovalType] = useState("");
    const documentApproval = useFetchDocumentApproval({
        documentApprovalId,
        isOpen,
    });
    const fetchedUsers = useFetchUsersApprovalRole(
        documentApprovalType,
        isOpen
    );
    const { closeModal } = useModalStore();

    const { data, setData, put, processing, errors, reset, clearErrors } =
        useForm<UpdateDocumentApprovalData>({
            resolution: "",
            type: "",
            users: [],
        });

    const [users, setUsers] = useState<DocumentApprovalUser[]>([]);
    const maxUsers = fetchedUsers.length;

    useEffect(() => {
        if (documentApproval) {
            setDocumentApprovalType(documentApproval.type);

            setUsers(
                (documentApproval.document_user_approvals || []).map(
                    (user: DocumentUserApproval) => ({
                        selectedUser: user.user_id.toString(),
                    })
                )
            );

            setData({
                resolution: documentApproval.resolution || "",
                type: documentApproval.type || "",
                users: (documentApproval.document_user_approvals || []).map(
                    (user: DocumentUserApproval) => ({
                        user_id: user.user_id,
                    })
                ),
            });
        }
    }, [documentApproval, isOpen, documentApprovalType]);

    useEffect(() => {
        if (!isOpen) setUsers([]);
    }, [documentApprovalType]);

    const handleClose = () => {
        closeModal("viewDocumentApproval");
        reset();
        clearErrors();
    };

    const handleUpdateDocumentApproval = (e: React.FormEvent) => {
        e.preventDefault();

        data.users = users
            .map((user) => parseInt(user.selectedUser))
            .filter((id) => !isNaN(id))
            .map((id) => ({ user_id: id.toString() }));

        put(route("document_approvals.update", documentApprovalId), {
            onSuccess: () => {
                handleClose();
                notifications.show({
                    position: "top-center",
                    message: "Document approval updated successfully",
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

    const selectedUserIds = users
        .map((user) => user.selectedUser)
        .filter((id) => id !== "");

    return {
        data,
        setData,
        handleUpdateDocumentApproval,
        processing,
        errors,
        handleClose,
        users,
        documentApproval,
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
