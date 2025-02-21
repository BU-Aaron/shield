import { Button, Stack, Modal, TextInput, Text, Flex } from "@mantine/core";
import { useAddWorkspace } from "../Hooks/use-add-workspace-form";
import useModalStore from "@/Modules/Common/Hooks/use-modal-store";

export default function WorkspaceForm() {
    const { data, setData, submit, processing, errors } = useAddWorkspace();
    const { modals, closeModal } = useModalStore();

    return (
        <Modal
            opened={modals["workspace"]}
            onClose={() => closeModal("workspace")}
            title={
                <Text fw={500} size="md">
                    Create New Section
                </Text>
            }
            size={550}
            radius={12}
            padding={"lg"}
        >
            <form onSubmit={submit}>
                <Stack gap={24}>
                    <TextInput
                        id="name"
                        type="text"
                        name="name"
                        value={data.name}
                        placeholder="Section Name"
                        onChange={(e) => setData("name", e.target.value)}
                        data-autofocus
                        error={errors.name}
                        styles={{
                            input: {
                                height: 48,
                            },
                        }}
                    />

                    <Flex align="center" justify="end">
                        <Button variant="light" onClick={() => closeModal("workspace")}>
                            Cancel
                        </Button>

                        <Button ml={12} type="submit" loading={processing}>
                            Create
                        </Button>
                    </Flex>
                </Stack>
            </form>
        </Modal>
    );
}
