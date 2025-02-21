import GuestLayout from "@/Modules/Common/Layouts/GuestLayout/Guest";
import { Head, Link, useForm } from "@inertiajs/react";
import { FormEventHandler } from "react";
import { Anchor, Button, Flex, Text } from "@mantine/core";

export default function VerifyEmail({ status }: { status?: string }) {
    const { post, processing } = useForm({});

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route("verification.send"));
    };

    return (
        <GuestLayout>
            <Head title="Email Verification" />

            <Text mb={16} size="sm" c="gray.8">
                Thanks for signing up! Before getting started, could you verify
                your email address by clicking on the link we just emailed to
                you? If you didn't receive the email, we will gladly send you
                another.
            </Text>

            {status === "verification-link-sent" && (
                <Text c="green" mb={16} size="sm" fw={500}>
                    A new verification link has been sent to the email address
                    you provided during registration.
                </Text>
            )}

            <form onSubmit={submit}>
                <Flex align="center" justify="space-between" mt={16}>
                    <Button type="submit" loading={processing}>
                        Resend Verification Email
                    </Button>

                    <Anchor
                        component={Link}
                        href={route("logout")}
                        method="post"
                        as="button"
                        c="gray.8"
                        size="sm"
                    >
                        Log Out
                    </Anchor>
                </Flex>
            </form>
        </GuestLayout>
    );
}
