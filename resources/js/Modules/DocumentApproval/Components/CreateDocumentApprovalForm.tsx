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
    Tooltip,
} from "@mantine/core";
import { IconTrash, IconPlus } from "@tabler/icons-react";
import { DocumentResourceData } from "@/Modules/Document/Types/DocumentResourceData";
import { useCreateDocumentApproval } from "../Hooks/use-create-document-approval";
import useModalStore from "@/Modules/Common/Hooks/use-modal-store";

interface IFormProps {
    document?: DocumentResourceData;
}

const CreateDocumentApprovalForm: React.FC<IFormProps> = ({ document }) => {
    const { modals, closeModal } = useModalStore();
    const isOpen = modals["createDocumentApproval"];

    const {
        data,
        setData,
        createApprovalSubmit,
        processing,
        errors,
        users,
        setDocumentApprovalType,
        addUser,
        removeUser,
        handleUserChange,
        addAllUsers,
        maxUsers,
        selectedUserIds,
        fetchedUsers,
    } = useCreateDocumentApproval({
        documentId: document?.item_id,
        isOpen,
    });

    // Function to generate options for each Select, excluding already selected users
    const getOptions = (currentIndex: number) => {
        return fetchedUsers
            .filter(
                (user) =>
                    !selectedUserIds.includes(user.id.toString()) ||
                    user.id.toString() === users[currentIndex].selectedUser
            )
            .map((user) => ({
                value: user.id.toString(),
                label: `${user.name} (${user.email})`,
            }));
    };

    return (
        <Modal
            opened={modals["createDocumentApproval"]}
            onClose={() => closeModal("createDocumentApproval")}
            title={
                <Text fw="bold" size="lg">
                    Create Document Approval Process
                </Text>
            }
            size={550}
        >
            <form onSubmit={createApprovalSubmit}>
                <Stack gap={16}>
                    <Radio.Group
                        name="status"
                        value={data.type}
                        onChange={(value) => {
                            setData("type", value);
                            setDocumentApprovalType(value);
                        }}
                        hidden
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
                        Users in this document approval
                    </Text>

                    {users.map((user, index) => (
                        <Group
                            key={index}
                            justify="space-between"
                            align="flex-end"
                        >
                            <Select
                                placeholder="Select a user"
                                data={getOptions(index)}
                                value={user.selectedUser}
                                onChange={(value) =>
                                    handleUserChange(index, value)
                                }
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

                    {/* Conditionally render the Add User and Add All Users buttons */}
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
                    <Button
                        variant="light"
                        onClick={() => closeModal("createDocumentApproval")}
                    >
                        Cancel
                    </Button>

                    <Button ml={12} type="submit" loading={processing}>
                        Create
                    </Button>
                </Flex>
            </form>
        </Modal>
    );
};

export default CreateDocumentApprovalForm;
