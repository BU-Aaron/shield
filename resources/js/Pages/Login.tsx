import { Text } from "@mantine/core";
import { Head } from "@inertiajs/react";
import GuestLayout from "@/Modules/Common/Layouts/GuestLayout/Guest";
import LoginForm from "@/Modules/Auth/Forms/LoginForm";

export default function Login({
    status,
    canResetPassword,
}: {
    status?: string;
    canResetPassword: boolean;
}) {
    return (
        <GuestLayout>
            <Head title="Log in" />

            {status && (
                <Text c="green" mb={16} size="sm" fw={500}>
                    {status}
                </Text>
            )}

            <LoginForm />
        </GuestLayout>
    );
}