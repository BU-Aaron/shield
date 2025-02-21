import { Button, Flex, TextInput } from "@mantine/core";
import { useConfirmPasswordForm } from "../Hooks/use-confirm-password-form";

export default function ConfirmPasswordForm() {
    const { data, setData, submit, processing, errors } = useConfirmPasswordForm();

    return (
        <form onSubmit={submit}>
            <TextInput
                id="password"
                type="password"
                name="password"
                value={data.password}
                autoComplete="current-password"
                leftSectionPointerEvents="none"
                label="Password"
                onChange={(e) => setData("password", e.target.value)}
                error={errors.password}
                mt={16}
            />

            <Flex align="center" justify="end" mt={16}>
                <Button ms={16} type="submit" loading={processing}>
                    Email Password Reset Link
                </Button>
            </Flex>
        </form>
    );
}