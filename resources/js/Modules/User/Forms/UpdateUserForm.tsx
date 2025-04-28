import React from "react";
import { Button, Flex, Modal, Select, Stack, Text, TextInput } from "@mantine/core";
import { useUpdateUser } from "../Hooks/use-update-user";
import { UserResourceData } from "../Types/UserResourceData";

interface IProps {
    isOpened: boolean;
    close: () => void;
    user?: UserResourceData;
}

const UpdateUserForm: React.FC<IProps> = ({ isOpened, close, user }) => {
    const { data, setData, submit, processing, errors } = useUpdateUser({ user, close });

    return (
        <Modal opened={isOpened} onClose={close} title={<Text size="lg">Edit User</Text>} size={550}>
            <form onSubmit={submit}>
                <Stack gap={16}>
                    <TextInput
                        id="office_position"
                        type="text"
                        name="office_position"
                        value={data.office_position}
                        label="Office Position"
                        onChange={(e) => setData("office_position", e.target.value)}
                        error={errors.office_position}
                    />

                    <Select
                        id="role"
                        name="role"
                        label="Role"
                        placeholder="Select role"
                        data={[
                            { value: "admin", label: "Admin" },
                            { value: "viewer", label: "Viewer" },
                        ]}
                        value={data.system_role}
                        onChange={(_value, option) => setData("system_role", option.value)}
                        error={errors.system_role}
                    />
                </Stack>

                <Flex align="center" justify="end" mt={16}>
                    <Button variant="outline" onClick={close}>
                        Cancel
                    </Button>

                    <Button ml={12} type="submit" loading={processing}>
                        Save
                    </Button>
                </Flex>
            </form>
        </Modal>
    );
};

export default UpdateUserForm;
