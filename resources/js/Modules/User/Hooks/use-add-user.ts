import { useForm } from "@inertiajs/react";
import { RegisterUserData } from "../Types/RegisterUserData";
import { notifications } from "@mantine/notifications";

interface IProps {
    close: () => void;
}

export function useAddUser({ close }: IProps) {
    const { data, setData, post, processing, errors, reset } =
        useForm<RegisterUserData>({
            name: "",
            username: "", 
            email: "",
            password:"",
            office_position: "",
            system_role: "",
            security_question_id: "",
            security_question_answer: "",
        });

    const submit: React.FormEventHandler = (e) => {
        e.preventDefault();
        post(route("users.register"), {
            onSuccess: () => {
                notifications.show({
                    position: "top-center",
                    message:
                        "New user added successfully. An email has been sent.",
                    color: "green",
                });
                reset();
                close();
            },
            onError: () => {
                notifications.show({
                    position: "top-center",
                    message: "Failed to add user.",
                    color: "red",
                });
            },
        });
    };

    return { data, setData, submit, processing, errors };
}
