import OfficeLogo from "@/Modules/Common/Components/OfficeLogo/OfficeLogo";
import { Button, Group, Stack, Text } from "@mantine/core";
import { IconPhoto } from "@tabler/icons-react";

const OfficeLogoForm = () => {
    return (
        <Group gap={240} align="start">
            <Stack gap={20} w={200}>
                <div>
                    <Text fw={600}>Office Logo</Text>
                    <Text c="dimmed">This image logo will be displayed on your system</Text>
                </div>
                <Button leftSection={<IconPhoto />} variant="outline">
                    Change Photo
                </Button>
            </Stack>

            {/* TODO: Change to picture logo uploaded by user */}
            <OfficeLogo h={96} w={96} />
        </Group>
    );
};

export default OfficeLogoForm;
