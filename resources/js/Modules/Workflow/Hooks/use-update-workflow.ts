import { useForm } from "@inertiajs/react";
import { notifications } from "@mantine/notifications";
import { UpdateWorkflowData } from "../Types/UpdateWorkflowData";
import { useFetchUsersApprovalRole } from "@/Modules/Common/Hooks/use-fetch-users-approval-role";
import { useEffect, useState } from "react";
import { useFetchWorkflow } from "./use-fetch-workflow";
import useModalStore from "@/Modules/Common/Hooks/use-modal-store";
import { ItemParentResourceData } from "@/Modules/Item/Types/ItemParentResourceData";

interface IProps {
    itemParent?: ItemParentResourceData;
    isOpen: boolean;
}

interface WorkflowUser {
    selectedUser: string;
}

export function useUpdateWorkflow({ itemParent, isOpen }: IProps) {
    const [workflowType, setWorkflowType] = useState("reviewal");
    const workflow = useFetchWorkflow({
        workflowId: itemParent?.workflow_id,
        isOpen,
    });
    const fetchedUsers = useFetchUsersApprovalRole(workflowType, isOpen);
    const { closeModal } = useModalStore();

    const { data, setData, put, processing, errors, reset, clearErrors } =
        useForm<UpdateWorkflowData>({
            resolution: "",
            type: "",
            users: [],
        });

    const [users, setUsers] = useState<WorkflowUser[]>([]);
    const maxUsers = fetchedUsers.length;

    useEffect(() => {
        if (workflow) {
            setWorkflowType(workflow.type || "");

            setData({
                resolution: workflow.resolution || "",
                type: workflow.type || "",
                users: workflow.users.map((user) => ({
                    user_id: user.id,
                })),
            });

            setUsers(
                workflow.users.map((user) => ({
                    selectedUser: user.id.toString(),
                }))
            );
        }
    }, [workflow, isOpen]);

    useEffect(() => {
        setUsers([]);
    }, [workflowType]);

    const handleUpdateWorkflow = (e: React.FormEvent) => {
        e.preventDefault();

        const selectedUserIds = users
            .map((user) => parseInt(user.selectedUser))
            .filter((id) => !isNaN(id));

        data.users = selectedUserIds.map((id) => ({ user_id: id }));

        put(route("workflows.update", itemParent?.workflow_id), {
            onSuccess: () => {
                closeModal("updateWorkflow");
                notifications.show({
                    position: "top-center",
                    message: "Workflow updated successfully",
                    color: "green",
                });
            },
            onError: (e) => {
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
        handleUpdateWorkflow,
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
