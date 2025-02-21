import { useRef, FormEventHandler } from "react";
import { Box, Button, Flex, rem, TextInput } from "@mantine/core";
import { useForm } from "@inertiajs/react";
import { Text, Transition } from "@mantine/core";
import classes from "../Styles/Edit.module.css";

export default function UpdatePasswordForm() {
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);

    const {
        data,
        setData,
        errors,
        put,
        reset,
        processing,
        recentlySuccessful,
    } = useForm({
        current_password: "",
        password: "",
        password_confirmation: "",
    });

    const updatePassword: FormEventHandler = (e) => {
        e.preventDefault();

        put(route("password.update"), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset("password", "password_confirmation");
                    passwordInput.current?.focus();
                }

                if (errors.current_password) {
                    reset("current_password");
                    currentPasswordInput.current?.focus();
                }
            },
        });
    };

    return (
        <Box style={{ maxWidth: rem(580) }}>
            <header>
                <Text size="lg"> Update Password</Text>

                <Text c="dimmed" mt={4} size="sm">
                    Ensure your account is using a long, random password to stay
                    secure.
                </Text>
            </header>

            <form onSubmit={updatePassword} className={classes.form}>
                <div>
                    <TextInput
                        id="current_password"
                        label="Current Password"
                        name="current_password"
                        ref={currentPasswordInput}
                        value={data.current_password}
                        onChange={(e) =>
                            setData("current_password", e.target.value)
                        }
                        type="password"
                        autoComplete="current-password"
                        mt={4}
                        error={errors.current_password}
                    />
                </div>

                <div>
                    <TextInput
                        id="password"
                        name="password"
                        label="New Password"
                        ref={passwordInput}
                        value={data.password}
                        onChange={(e) => setData("password", e.target.value)}
                        type="password"
                        className="block w-full mt-1"
                        autoComplete="new-password"
                        mt={4}
                        error={errors.password}
                    />
                </div>

                <div>
                    <TextInput
                        id="password_confirmation"
                        name="password_confirmation"
                        label="Confirm Password"
                        value={data.password_confirmation}
                        onChange={(e) =>
                            setData("password_confirmation", e.target.value)
                        }
                        type="password"
                        className="block w-full mt-1"
                        autoComplete="new-password"
                        mt={4}
                        error={errors.password_confirmation}
                    />
                </div>

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
