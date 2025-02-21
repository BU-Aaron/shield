import { Button, Group } from "@mantine/core";
import { IconTrashX } from "@tabler/icons-react";

const TrashToolbar = () => {
    return (
        <Group
            h="50%"
            px="md"
            align="center"
            justify="flex-start"
        >
            <Button
                variant="subtle"
                color="dark.3"
                leftSection={<IconTrashX size={18} />}
            >
                Empty Bin
            </Button>
        </Group>
    );
};

export default TrashToolbar;
