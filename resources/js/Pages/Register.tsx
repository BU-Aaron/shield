import { useEffect, FormEventHandler } from "react";
import GuestLayout from "@/Modules/Common/Layouts/GuestLayout/Guest";
import { Head, Link, useForm } from "@inertiajs/react";
import { Anchor, Button, Flex, Stack, TextInput } from "@mantine/core";

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        email: "",
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

        post(route("register"));
    };

    return (
        <GuestLayout>
            <Head title="Register" />

            <form onSubmit={submit}>
                <Stack gap={16}>
                    <TextInput
                        id="name"
                        type="name"
                        name="name"
                        value={data.name}
                        autoComplete="name"
                        leftSectionPointerEvents="none"
                        label="Name"
                        onChange={(e) => setData("name", e.target.value)}
                        error={errors.name}
                        required
                    />

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
                        required
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
                        required
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
                        required
                    />
                </Stack>

                <Flex align="center" justify="end" mt={16}>
                    <Anchor component={Link} href={route("login")} size="sm">
                        Already registered?
                    </Anchor>

                    <Button ml={16} type="submit" loading={processing}>
                        Register
                    </Button>
                </Flex>
            </form>
        </GuestLayout>
    );
}
