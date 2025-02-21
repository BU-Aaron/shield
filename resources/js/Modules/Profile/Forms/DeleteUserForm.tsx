import { useRef, useState, FormEventHandler } from "react";
import { Box, Flex, Modal, rem } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { TextInput } from "@mantine/core";
import { useForm } from "@inertiajs/react";
import { Button, Text } from "@mantine/core";
import classes from "../Edit.module.css";

export default function DeleteUserForm() {
    const passwordInput = useRef<HTMLInputElement>(null);
    const [opened, { open, close }] = useDisclosure(false);

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
    } = useForm({
        password: "",
    });

    const deleteUser: FormEventHandler = (e) => {
        e.preventDefault();

        destroy(route("profile.destroy"), {
            preserveScroll: true,
            onSuccess: () => close(),
            onError: () => passwordInput.current?.focus(),
            onFinish: () => reset(),
        });
    };

    const cancelDelete = () => {
        close();
        reset();
    };

    return (
        <Box style={{ maxWidth: rem(580) }}>
            <header>
                <Text size="lg">Delete Account</Text>

                <Text c="dimmed" mt={4} size="sm">
                    Once your account is deleted, all of its resources and data
                    will be permanently deleted. Before deleting your account,
                    please download any data or information that you wish to
                    retain.
                </Text>
            </header>

            <Button color="red" onClick={open} mt={24}>
                Delete Account
            </Button>

            <Modal
                opened={opened}
                onClose={close}
                centered
                title={
                    <Text size="lg">
                        Are you sure you want to delete your account?
                    </Text>
                }
                size="lg"
            >
                <form onSubmit={deleteUser}>
                    <Text c="dimmed" mt={4} size="sm" pr={4}>
                        Once your account is deleted, all of its resources and
                        data will be permanently deleted. Before deleting your
                        account, please download any data or information that
                        you wish to retain.
                    </Text>

                    <Box my={24}>
                        <TextInput
                            id="password"
                            name="password"
                            type="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(e) =>
                                setData("password", e.target.value)
                            }
                            mt={4}
                            placeholder="Password"
                            error={errors.password}
                            autoFocus
                        />
                    </Box>

                    <Flex justify="end" mt={24}>
                        <Button
                            variant="subtle"
                            color="gray"
                            onClick={cancelDelete}
                        >
                            Cancel
                        </Button>

                        <Button
                            color="red"
                            ml={12}
                            loading={processing}
                            type="submit"
                        >
                            Delete Account
                        </Button>
                    </Flex>
                </form>
            </Modal>
        </Box>
    );
}
