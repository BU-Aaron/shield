import { Head } from "@inertiajs/react";
import { Divider, Stack } from "@mantine/core";
import { Authenticated } from "@/Modules/Common/Layouts/AuthenticatedLayout/Authenticated";
import OfficeLogo from "@/Modules/Customization/OfficeLogo";
import OrganizationDetails from "@/Modules/Customization/OrganizationDetails";
import Themes from "@/Modules/Customization/Themes";

export default function CustomizationPage() {
    return (
        <Authenticated>
            <Head title="Customization" />
            <Stack px={8} gap={48} py={8} mx={32} mt={32}>
                <OfficeLogo />

                <Divider c="dimmed" />

                <OrganizationDetails />

                <Divider c="dimmed" />

                <Themes />

                <Divider c="dimmed" />
            </Stack>
        </Authenticated>
    );
}
