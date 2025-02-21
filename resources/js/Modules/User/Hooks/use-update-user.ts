import { useForm } from "@inertiajs/react";
import { UpdateUserData } from "../Types/UpdateUserData";
import { notifications } from "@mantine/notifications";
import { UserResourceData } from "../Types/UserResourceData";
import { useEffect } from "react";

interface IProps {
    user?: UserResourceData;
    close: () => void;
}

export function useUpdateUser({ user, close }: IProps) {
    const { data, setData, put, processing, errors, reset } =
        useForm<UpdateUserData>({
            office_position: "",
            workflow_role: "",
            system_role: "",
        });

    useEffect(() => {
        if (user) {
            setData({
                workflow_role: user.workflow_role,
                office_position: user.office_position,
                system_role: user.system_role,
            });
        }
    }, [user]);

    const submit: React.FormEventHandler = (e) => {
        e.preventDefault();
        if (!user) return;

        put(route("users.update", user.id), {
            onSuccess: () => {
                notifications.show({
                    position: "top-center",
                    message: "User updated successfully",
                    color: "green",
                });
                close();
                reset();
            },
            onError: (errors) => {
                notifications.show({
                    position: "top-center",
                    message: "Failed to update user",
                    color: "red",
                });
            },
        });
    };

    return { data, setData, submit, processing, errors };
}
