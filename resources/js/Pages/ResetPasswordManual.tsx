import { useForm } from '@inertiajs/react';
import GuestLayout from "@/Modules/Common/Layouts/GuestLayout/Guest";

import { Button, TextInput, Title, Container } from '@mantine/core';

export default function ResetPasswordManual({ username }: { username: string; }) {
    const { data, setData, post, processing, errors } = useForm({
        password: "",
        password_confirmation: ""
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('password.manual'));
    };

    return (
        <GuestLayout>
            <Title order={2}>Reset Password</Title>
            <form onSubmit={submit}>
                <TextInput
                    label="New Password"
                    name="password"
                    type="password"
                    value={data.password}
                    onChange={(e) => setData('password', e.target.value)}
                    error={errors.password}
                    mt={16}
                />
                <TextInput
                    label="Confirm Password"
                    name="password_confirmation"
                    type="password"
                    value={data.password_confirmation}
                    onChange={(e) => setData('password_confirmation', e.target.value)}
                    error={errors.password_confirmation}
                    mt={16}
                />
                <Button type="submit" loading={processing} mt={16}>
                    Reset Password
                </Button>
            </form>
        </GuestLayout>
    );
}
