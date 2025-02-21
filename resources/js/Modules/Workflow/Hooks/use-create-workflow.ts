import { useState, FormEventHandler, useEffect } from "react";
import { useForm } from "@inertiajs/react";
import { notifications } from "@mantine/notifications";
import useModalStore from "@/Modules/Common/Hooks/use-modal-store";
import { CreateWorkflowData } from "@/Modules/Workflow/Types/CreateWorkflowData";
import { useFetchUsersApprovalRole } from "@/Modules/Common/Hooks/use-fetch-users-approval-role";

interface IProps {
    itemParentId?: string;
}

interface UserOption {
    id: number;
    name: string;
    email: string;
}

interface WorkflowUser {
    selectedUser: string;
}

export function useCreateWorkflow({ itemParentId }: IProps) {
    const [workflowType, setWorkflowType] = useState("reviewal");
    const { closeModal, modals } = useModalStore();
    const fetchedUsers: UserOption[] = useFetchUsersApprovalRole(
        workflowType,
        modals["createWorkflow"]
    );

    const { data, setData, post, processing, errors, reset } =
        useForm<CreateWorkflowData>({
            folder_item_id: "",
            resolution: "",
            destination: "",
            type: "reviewal",
            users: [],
        });

    const [users, setUsers] = useState<WorkflowUser[]>([]);
    const maxUsers = fetchedUsers.length;

    useEffect(() => {
        // Reset users when workflow type changes
        setUsers([]);
    }, [workflowType, fetchedUsers]);

    // useEffect(() => {
    //     // Initialize with one user Select by default when fetchedUsers change
    //     // setUsers([
    //     //     {
    //     //         selectedUser: "",
    //     //     },
    //     // ]);
    // }, [fetchedUsers]);

    const createApprovalSubmit: FormEventHandler = (e) => {
        e.preventDefault();

        const selectedUserIds = users
            .map((user) => parseInt(user.selectedUser))
            .filter((id) => !isNaN(id));

        data.folder_item_id = itemParentId ?? "";
        data.users = selectedUserIds.map((id) => ({ user_id: id }));

        post(route("workflows.store"), {
            preserveScroll: true,
            onSuccess: () => {
                closeModal("createWorkflow");
                notifications.show({
                    position: "top-center",
                    message: "Approval process created",
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
        setWorkflowType,
        addUser,
        removeUser,
        handleUserChange,
        addAllUsers,
        maxUsers,
        selectedUserIds,
        fetchedUsers,
    };
}
