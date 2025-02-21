import { Text } from "@mantine/core";
import { Head } from "@inertiajs/react";
import GuestLayout from "@/Modules/Common/Layouts/GuestLayout/Guest";
import ConfirmPasswordForm from "@/Modules/Auth/Forms/ConfirmPasswordForm";

export default function ConfirmPassword() {
    return (
        <GuestLayout>
            <Head title="Confirm Password" />

            <Text mb={16} size="sm">
                This is a secure area of the application. Please confirm your
                password before continuing.
            </Text>

            <ConfirmPasswordForm />
        </GuestLayout>
    );
}