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
import { useState } from "react";
import useModalStore from "@/Modules/Common/Hooks/use-modal-store";
import { useShareFolder } from "../Hooks/use-share-folder";

interface ShareModalFormProps {
    folderId: string;
}

const ShareModalForm: React.FC<ShareModalFormProps> = ({ folderId }) => {
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
    } = useShareFolder({
        folderId,
        close: () => closeModal("shareFolder"),
    });

    const handleAddAllUsers = () => {
        const allUsers = fetchedUsers.map(user => ({
            email: user.email,
            role: "viewer" as const,
        }));
        addAllUsersHelper(allUsers);
    };

    const addAllUsersHelper = (allUsers: { email: string; role: string }[]) => {
        allUsers.forEach(() => addUser());
    };

    return (
        <Modal
            opened={modals["shareFolder"]}
            onClose={() => closeModal("shareFolder")}
            title={<Text size="lg">Share Folder</Text>}
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
                            onClick={handleAddAllUsers}
                            disabled={data.users.length >= fetchedUsers.length}
                        >
                            Add All Users
                        </Button>
                    </Group>
                </Stack>

                <Group mt="md">
                    <Button variant="outline" onClick={() => closeModal("shareFolder")}>
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

export default ShareModalForm;