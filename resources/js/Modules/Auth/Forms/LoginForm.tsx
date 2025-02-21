import { IconLock, IconUser } from "@tabler/icons-react";
import {
    Button,
    Checkbox,
    Flex,
    PasswordInput,
    Stack,
    Text,
    TextInput,
} from "@mantine/core";
import { useLoginForm } from "../Hooks/use-login-form";

export default function LoginForm() {
    const { data, setData, submit, processing, errors } = useLoginForm();

    return (
        <form onSubmit={submit}>
            <Stack gap={32}>
                <div>
                    <Text fw={700} fz={24} ta="center">
                        Login to
                    </Text>
                    <Text fw={500} fz={16} ta="center" c="gray.6">
                        BU International Relations Office
                    </Text>
                </div>

                <Stack gap={24}>
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        autoComplete="username"
                        leftSectionPointerEvents="none"
                        placeholder="Email address"
                        leftSection={<IconUser size={20} />}
                        size="md"
                        onChange={(e) => setData("email", e.target.value)}
                        error={errors.email}
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
                        Sign in
                    </Button>
                </Flex>
            </Stack>
        </form>
    );
}
