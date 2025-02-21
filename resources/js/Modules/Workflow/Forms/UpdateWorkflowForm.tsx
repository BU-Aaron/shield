import {
    Avatar,
    Button,
    Flex,
    Group,
    Modal,
    Paper,
    Radio,
    Stack,
    Text,
    Textarea,
    ActionIcon,
    Select,
} from "@mantine/core";
import { IconTrash, IconPlus } from "@tabler/icons-react";
import { ItemParentResourceData } from "@/Modules/Item/Types/ItemParentResourceData";
import useModalStore from "@/Modules/Common/Hooks/use-modal-store";
import { useUpdateWorkflow } from "../Hooks/use-update-workflow";
import ConfirmDeleteWorkflowForm from "./ConfirmDeleteWorkflowForm";

interface IFormProps {
    itemParent?: ItemParentResourceData;
}

const UpdateWorkflowForm: React.FC<IFormProps> = ({ itemParent }) => {
    const { modals, closeModal, openModal } = useModalStore();
    const isOpen = modals["updateWorkflow"];

    const {
        data,
        setData,
        handleUpdateWorkflow,
        processing,
        users,
        setWorkflowType,
        addUser,
        removeUser,
        handleUserChange,
        addAllUsers,
        maxUsers,
        selectedUserIds,
        fetchedUsers,
        errors,
    } = useUpdateWorkflow({
        itemParent,
        isOpen,
    });

    const getOptions = (currentIndex: number) => {
        return fetchedUsers
            .filter(user => !selectedUserIds.includes(user.id.toString()) || user.id.toString() === users[currentIndex].selectedUser)
            .map(user => ({
                value: user.id.toString(),
                label: `${user.name} (${user.email})`,
            }));
    };

    return (
        <>
            <Modal
                opened={isOpen}
                onClose={() => closeModal("updateWorkflow")}
                title={
                    <Text fw="bold" size="lg">
                        Update Workflow Process
                    </Text>
                }
                size={550}
            >
                <form onSubmit={handleUpdateWorkflow}>
                    <Stack gap={16}>
                        <Text size="sm" c="dimmed">
                            Routinely directs any uploaded file in this folder through a predefined
                            approval workflow
                        </Text>

                        <Radio.Group
                            name="status"
                            value={data.type}
                            onChange={(value: string) => {
                                setData("type", value);
                                setWorkflowType(value);
                            }}
                        >
                            <Group mt="xs">
                                <Radio value="reviewal" label="Review" />
                                <Radio value="approval" label="Approval" />
                            </Group>
                        </Radio.Group>

                        <Textarea
                            label="Resolution"
                            placeholder="Your resolution for this approval"
                            value={data.resolution ?? ""}
                            onChange={(e) => setData("resolution", e.target.value)}
                            error={errors.resolution}
                            autosize
                            minRows={2}
                            maxRows={4}
                        />

                        <Text size="sm" fw={500} mb={-8}>
                            Users in this workflow
                        </Text>

                        {users.map((user, index) => (
                            <Group key={index} justify="space-between" align="flex-end">
                                <Select
                                    placeholder="Select a user"
                                    data={getOptions(index)}
                                    value={user.selectedUser}
                                    onChange={(value) => handleUserChange(index, value)}
                                    required
                                    style={{ flex: 1 }}
                                    allowDeselect={false}
                                />
                                <ActionIcon
                                    color="red"
                                    onClick={() => removeUser(index)}
                                    title="Remove User"
                                >
                                    <IconTrash size={18} />
                                </ActionIcon>
                            </Group>
                        ))}

                        <Group>
                            {users.length < maxUsers && (
                                <Button
                                    variant="subtle"
                                    color="green"
                                    leftSection={<IconPlus size={16} />}
                                    onClick={addUser}
                                    disabled={users.length >= maxUsers}
                                >
                                    Add User
                                </Button>
                            )}

                            {selectedUserIds.length < maxUsers && (
                                <Button
                                    variant="subtle"
                                    color="blue"
                                    leftSection={<IconPlus size={16} />}
                                    onClick={addAllUsers}
                                    disabled={users.length >= maxUsers}
                                >
                                    Add All Users
                                </Button>
                            )}
                        </Group>
                    </Stack>

                    <Flex align="center" justify="end" mt={16}>
                        <Button variant="light" onClick={() => closeModal("updateWorkflow")}>
                            Cancel
                        </Button>

                        <Button ml={12} type="submit" loading={processing}>
                            Update
                        </Button>

                        <ActionIcon
                            variant="transparent"
                            color="red"
                            onClick={() => {
                                openModal("confirmDeleteWorkflow");
                                closeModal("updateWorkflow");
                            }}
                            title="Delete Workflow"
                            ml={12}
                        >
                            <IconTrash size={18} />
                        </ActionIcon>
                    </Flex>
                </form>
            </Modal>
            <ConfirmDeleteWorkflowForm workflowId={itemParent?.workflow_id} />
        </>
    );
};

export default UpdateWorkflowForm;