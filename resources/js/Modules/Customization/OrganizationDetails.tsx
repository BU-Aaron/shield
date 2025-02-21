import { Button, Group, Stack, Text, TextInput } from "@mantine/core";

const OrganizationDetails = () => {
    return (
        <Group gap={240} align="start">
            <Stack gap={20} w={200}>
                <div>
                    <Text fw={600}>Organization Name</Text>
                    <Text c="dimmed">Update your office name</Text>
                </div>
                <Button>Save Changes</Button>
            </Stack>

            <TextInput id="name" type="text" name="name" label="Organization Name" w={550} />
        </Group>
    );
};

export default OrganizationDetails;
