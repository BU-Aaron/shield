import { useForm } from '@inertiajs/react';
import GuestLayout from "@/Modules/Common/Layouts/GuestLayout/Guest";
import { Button, TextInput, Title } from '@mantine/core';

export default function ForgotPasswordUsername() {
    const { data, setData, post, processing, errors } = useForm({
        username: ""
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('password.username'));
    };

    return (
        <GuestLayout>
            <Title order={2}>Forgot Password</Title>
            <form onSubmit={submit}>
                <TextInput
                    label="Username"
                    name="username"
                    value={data.username}
                    onChange={(e) => setData('username', e.target.value)}
                    error={errors.username}
                    mt={16}
                />
                <Button type="submit" loading={processing} mt={16}>
                    Next
                </Button>
            </form>
        </GuestLayout>
    );
}
