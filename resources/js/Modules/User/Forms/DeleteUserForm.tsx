import React from "react";
import { Button, Flex, Modal, Text } from "@mantine/core";
import { useDeleteUser } from "../Hooks/use-delete-user";
import { UserResourceData } from "../Types/UserResourceData";

interface IProps {
    isOpened: boolean;
    close: () => void;
    user?: UserResourceData;
}

const DeleteUserForm: React.FC<IProps> = ({ isOpened, close, user }) => {
    const { submit, processing } = useDeleteUser({ user, close });

    return (
        <Modal
            opened={isOpened}
            onClose={close}
            title={<Text size="lg">Delete User</Text>}
            size={550}
        >
            <form onSubmit={submit}>
                <Text c="dimmed" mt={4} size="sm">
                    Are you sure you want to delete the user "{user?.name}"? This action cannot be undone.
                </Text>

                <Flex align="center" justify="end" mt={16}>
                    <Button variant="outline" onClick={close}>
                        Cancel
                    </Button>

                    <Button ml={12} type="submit" loading={processing} color="red">
                        Confirm Delete
                    </Button>
                </Flex>
            </form>
        </Modal>
    );
};

export default DeleteUserForm;