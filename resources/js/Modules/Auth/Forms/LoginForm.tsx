import { IconLock, IconUser } from "@tabler/icons-react";
import {
    Anchor,
    Button,
    Checkbox,
    Flex,
    PasswordInput,
    Stack,
    Text,
    TextInput,
} from "@mantine/core";
import { useLoginForm } from "../Hooks/use-login-form";
import { Link } from "@inertiajs/react";

export default function LoginForm() {
    const { data, setData, submit, processing, errors } = useLoginForm();

    return (
        <form onSubmit={submit}>
            <Stack gap={32}>
                <div>
                    <Text fw={700} fz={24} ta="center">
                        Login
                    </Text>
                    <Text fw={500} fz={16} ta="center" c="gray.6">
                        RACU 5 Document Management System
                    </Text>
                </div>

                <Stack gap={24}>
                    <TextInput
                        id="username"
                        type="text"
                        name="username"
                        value={data.username}
                        autoComplete="username"
                        leftSectionPointerEvents="none"
                        placeholder="Username"
                        leftSection={<IconUser size={20} />}
                        size="md"
                        onChange={(e) => setData("username", e.target.value)}
                        error={errors.username}
                    />

                    <PasswordInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        autoComplete="current-password"
                        leftSectionPointerEvents="none"
                        placeholder="Password"
                        leftSection={<IconLock size={20} />}
                        size="md"
                        onChange={(e) => setData("password", e.target.value)}
                        error={errors.password}
                    />
                </Stack>

                <Flex align="center">
                    <Checkbox
                        name="remember"
                        checked={data.remember}
                        onChange={(e) => setData("remember", e.target.checked)}
                        label="Remember me"
                        size="md"
                    />
                </Flex>

                <Flex align="center" justify="end">
                    <Button
                        type="submit"
                        loading={processing}
                        size="md"
                        radius="md"
                        fullWidth
                    >
                        Login
                    </Button>
                </Flex>
                <Anchor
                    component={Link}
                    href={route("password.username")}
                    ta="center"
                    size="sm"
                >
                    Forgot Password?
                </Anchor>
            </Stack>
        </form>
    );
}