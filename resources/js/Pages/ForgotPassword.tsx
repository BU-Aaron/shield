import GuestLayout from "@/Modules/Common/Layouts/GuestLayout/Guest";
import { Button, Flex, TextInput } from "@mantine/core";
import { Head, useForm } from "@inertiajs/react";
import { FormEventHandler } from "react";
import { Text } from "@mantine/core";

export default function ForgotPassword({ status }: { status?: string }) {
    const { data, setData, post, processing, errors } = useForm({
        email: "",
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route("password.email"));
    };

    return (
        <GuestLayout>
            <Head title="Forgot Password" />

            <Text mb={16} size="sm">
                Forgot your password? No problem. Just let us know your email
                address and we will email you a password reset link that will
                allow you to choose a new one.
            </Text>

            {status && (
                <Text c="green" mb={16} size="sm" fw={500}>
                    {status}
                </Text>
            )}

            <form onSubmit={submit}>
                <TextInput
                    id="email"
                    type="email"
                    name="email"
                    value={data.email}
                    autoComplete="username"
                    leftSectionPointerEvents="none"
                    label="Enter your email"
                    onChange={(e) => setData("email", e.target.value)}
                    error={errors.email}
                />

                <Flex align="center" justify="end" mt={16}>
                    <Button ms={16} type="submit" loading={processing}>
                        Email Password Reset Link
                    </Button>
                </Flex>
            </form>
        </GuestLayout>
    );
}
