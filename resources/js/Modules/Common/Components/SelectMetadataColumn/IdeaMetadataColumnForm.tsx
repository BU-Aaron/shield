import { Button } from "@mantine/core";

import { ActionIcon, Group, Select, Modal, Stack, Text, Flex } from "@mantine/core";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import useModalStore from "../../Hooks/use-modal-store";

const IdeaMetadataColumnForm = () => {
    const { modals, closeModal } = useModalStore();

    return (
        <Modal
            opened={modals["ideaMetadataColumnForm"]}
            onClose={() => closeModal("ideaMetadataColumnForm")}
            title={
                <Text fw="bold" size="lg">
                    Modify Columns
                </Text>
            }
            size={550}
        >
            <form>
                <Stack gap={16}>
                    <Group justify="space-between">
                        <Select
                            placeholder="Pick value"
                            data={["Name", "Numbering", "Date", "Country"]}
                            w="90%"
                        />

                        <ActionIcon color="gray" variant="subtle">
                            <IconTrash size="1rem" />
                        </ActionIcon>
                    </Group>

                    <Group justify="space-between">
                        <Select
                            placeholder="Pick value"
                            data={["Name", "Numbering", "Date", "Country"]}
                            w="90%"
                        />

                        <ActionIcon color="gray" variant="subtle">
                            <IconTrash size="1rem" />
                        </ActionIcon>
                    </Group>

                    <Group justify="space-between">
                        <Select
                            placeholder="Pick value"
                            data={["Name", "Numbering", "Date", "Country"]}
                            w="90%"
                        />

                        <ActionIcon color="gray" variant="subtle">
                            <IconTrash size="1rem" />
                        </ActionIcon>
                    </Group>

                    <Flex justify="flex-start">
                        <Button
                            variant="subtle"
                            color="blue.5"
                            leftSection={<IconPlus size={18} />}
                        >
                            Add New Column
                        </Button>
                    </Flex>
                </Stack>

                <Flex align="center" justify="end" mt={16}>
                    <Button variant="outline" onClick={close}>
                        Cancel
                    </Button>

                    <Button ml={12} type="submit">
                        Create
                    </Button>
                </Flex>
            </form>
        </Modal>
    );
};

export default IdeaMetadataColumnForm;
