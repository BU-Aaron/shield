import { useEffect } from "react";
import { useForm } from "@inertiajs/react";
import { ConfirmPasswordFormData } from "../Types/ConfirmPasswordFormData";

export function useConfirmPasswordForm() {
    const { data, setData, post, processing, errors, reset } = useForm<ConfirmPasswordFormData>({
        password: "",
    });

    useEffect(() => {
        return () => {
            reset("password");
        };
    }, []);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("password.confirm"));
    };

    return { data, setData, submit, processing, errors };
}