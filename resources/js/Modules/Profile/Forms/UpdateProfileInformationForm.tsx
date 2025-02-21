import { Link, useForm, usePage } from "@inertiajs/react";
import { FormEventHandler } from "react";
import { PageProps } from "@/Modules/Common/Types";
import {
    Anchor,
    Box,
    Button,
    Flex,
    rem,
    Text,
    TextInput,
    Transition,
} from "@mantine/core";
import classes from "../Styles/Edit.module.css";

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
}: {
    mustVerifyEmail: boolean;
    status?: string;
}) {
    const user = usePage<PageProps>().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
        });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        patch(route("profile.update"));
    };

    return (
        <Box style={{ maxWidth: rem(580) }}>
            <header>
                <Text size="lg">Profile Information</Text>

                <Text c="dimmed" mt={4} size="sm">
                    Update your account's profile information and email address.
                </Text>
            </header>

            <form onSubmit={submit} className={classes.form}>
                <div>
                    <TextInput
                        id="name"
                        type="name"
                        name="name"
                        value={data.name}
                        mt={4}
                        autoComplete="name"
                        leftSectionPointerEvents="none"
                        label="Name"
                        onChange={(e) => setData("name", e.target.value)}
                        error={errors.name}
                        required
                    />
                </div>

                <div>
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
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div>
                        <Text mt={8} size="sm">
                            Your email address is unverified.{" "}
                            <Anchor
                                component={Link}
                                href={route("verification.send")}
                                method="post"
                                as="button"
                            >
                                Click here to re-send the verification email.
                            </Anchor>
                        </Text>

                        {status === "verification-link-sent" && (
                            <Text c="green" mt={8} size="sm" fw={500}>
                                A new verification link has been sent to your
                                email address.
                            </Text>
                        )}
                    </div>
                )}

                <Flex align="center" gap={16}>
                    <Button type="submit" loading={processing}>
                        Save
                    </Button>

                    <Transition
                        mounted={recentlySuccessful}
                        transition="fade"
                        duration={400}
                    >
                        {(styles) => (
                            <Text c="gray" size="sm" style={styles}>
                                Saved
                            </Text>
                        )}
                    </Transition>
                </Flex>
            </form>
        </Box>
    );
}
