import { useEffect, FormEventHandler } from "react";
import { useForm } from "@inertiajs/react";
import { LoginData } from "../Types/LoginData";

export function useLoginForm() {
    const { data, setData, post, processing, errors, reset } = useForm<LoginData>({
        email: "",
        password: "",
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset("password");
        };
    }, []);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route("login"));
    };

    return { data, setData, submit, processing, errors };
}