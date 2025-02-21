import { useEffect, FormEventHandler } from "react";
import GuestLayout from "@/Modules/Common/Layouts/GuestLayout/Guest";
import { Button, Flex, Stack, TextInput } from "@mantine/core";
import { Head, useForm } from "@inertiajs/react";

export default function ResetPassword({
    token,
    email,
}: {
    token: string;
    email: string;
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: "",
        password_confirmation: "",
    });

    useEffect(() => {
        return () => {
            reset("password", "password_confirmation");
        };
    }, []);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route("password.store"));
    };

    return (
        <GuestLayout>
            <Head title="Reset Password" />

            <form onSubmit={submit}>
                <Stack gap={16}>
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        mt={4}
                        autoComplete="username"
                        leftSectionPointerEvents="none"
                        label="Email"
                        onChange={(e) => setData("email", e.target.value)}
                        error={errors.email}
                    />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        autoComplete="new-password"
                        leftSectionPointerEvents="none"
                        label="Password"
                        onChange={(e) => setData("password", e.target.value)}
                        error={errors.password}
                    />

                    <TextInput
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        autoComplete="new-password"
                        leftSectionPointerEvents="none"
                        label="Confirm Password"
                        onChange={(e) =>
                            setData("password_confirmation", e.target.value)
                        }
                        error={errors.password}
                    />
                </Stack>

                <Flex align="center" justify="end" mt={16}>
                    <Button ms={16} type="submit" loading={processing}>
                        Reset Password
                    </Button>
                </Flex>
            </form>
        </GuestLayout>
    );
}
