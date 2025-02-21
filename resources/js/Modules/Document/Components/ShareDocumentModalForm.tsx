import {
    Button,
    Group,
    Modal,
    Select,
    Stack,
    Text,
    ActionIcon,
    Tooltip,
} from "@mantine/core";
import { IconTrash, IconPlus } from "@tabler/icons-react";
import { useFetchUsers } from "@/Modules/Common/Hooks/use-fetch-users";
import { UserResourceData } from "@/Modules/User/Types/UserResourceData";
import { useShareDocument } from "../Hooks/use-share-document";
import useModalStore from "@/Modules/Common/Hooks/use-modal-store";

interface ShareDocumentModalFormProps {
    documentId: string;
}

const ShareDocumentModalForm: React.FC<ShareDocumentModalFormProps> = ({ documentId }) => {
    const { modals, closeModal } = useModalStore();
    const { users: fetchedUsers, loading, error } = useFetchUsers();
    const {
        data,
        submit,
        processing,
        errors,
        addUser,
        removeUser,
        handleUserChange,
        handleAddAllUsers,
    } = useShareDocument({
        documentId,
        close: () => closeModal("shareDocument"),
    });

    const handleAddAllUsersClick = () => {
        const allUsers = fetchedUsers.map(user => ({
            email: user.email,
            role: "viewer" as const,
        }));
        handleAddAllUsers(allUsers);
    };

    return (
        <Modal
            opened={modals["shareDocument"]}
            onClose={() => closeModal("shareDocument")}
            title={<Text size="lg">Share Document</Text>}
            size="600"
        >
            <form onSubmit={(e) => { e.preventDefault(); submit(); }}>
                <Stack>
                    {data.users.map((user, index) => (
                        <Group key={index} align="flex-end">
                            <Select
                                data={fetchedUsers.map((u) => ({
                                    value: u.email,
                                    label: `${u.name} (${u.email})`,
                                }))}
                                placeholder="Select a user"
                                value={user.email}
                                onChange={(value) => handleUserChange(index, 'email', value || '')}
                                style={{ flex: 1 }}
                                required
                            />
                            <Select
                                data={[
                                    { value: 'viewer', label: 'Viewer' },
                                    { value: 'editor', label: 'Editor' },
                                ]}
                                placeholder="Select role"
                                value={user.role}
                                onChange={(value) => handleUserChange(index, 'role', value || 'viewer')}
                                style={{ width: 120 }}
                                required
                            />
                            <Tooltip label="Remove User" withArrow>
                                <ActionIcon color="red" onClick={() => removeUser(index)}>
                                    <IconTrash size={18} />
                                </ActionIcon>
                            </Tooltip>
                        </Group>
                    ))}

                    <Group>
                        <Button
                            variant="subtle"
                            color="green"
                            leftSection={<IconPlus size={16} />}
                            onClick={() => addUser()}
                        >
                            Add User
                        </Button>

                        <Button
                            variant="subtle"
                            color="blue"
                            leftSection={<IconPlus size={16} />}
                            onClick={handleAddAllUsersClick}
                            disabled={data.users.length >= fetchedUsers.length}
                        >
                            Add All Users
                        </Button>
                    </Group>
                </Stack>

                <Group mt="md">
                    <Button variant="outline" onClick={() => closeModal("shareDocument")}>
                        Cancel
                    </Button>
                    <Button type="submit" loading={processing}>
                        Save
                    </Button>
                </Group>
            </form>
        </Modal>
    );
};

export default ShareDocumentModalForm;