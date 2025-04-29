import React, { useState } from "react";
import {
    Button,
    Flex,
    Modal,
    Select,
    Stack,
    Text,
    TextInput,
} from "@mantine/core";
import { useAddUser } from "../Hooks/use-add-user";

interface IProps {
    isOpened: boolean;
    close: () => void;
}

const AddUserForm: React.FC<IProps> = ({ isOpened, close }) => {
    const { data, setData, submit, processing, errors } = useAddUser({
        close,
    });

    const handleClose = () => {
        close();
        // Optionally reset form here if not handled in the hook
    };

    return (
        <Modal
            opened={isOpened}
            onClose={handleClose}
            title={
                <Text size="lg" fw={500}>
                    Add User
                </Text>
            }
            size={550}
        >
            <form onSubmit={submit}>
                <Stack gap={16}>
                    <TextInput
                        id="name"
                        type="text"
                        name="name"
                        value={data.name}
                        label="Name"
                        onChange={(e) => setData("name", e.target.value)}
                        error={errors.name}
                    />

                <TextInput
                        id="username"
                        type="text"
                        name="username"
                        value={data.username}
                        label="Username"
                        onChange={(e) => setData("username", e.target.value)}
                        error={errors.username}
                    />
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        label="Email"
                        onChange={(e) => setData("email", e.target.value)}
                        error={errors.email}
                    />

                    <TextInput
                        id="password"
                        type="text"
                        name="password"
                        placeholder="Enter Password"
                        onChange={(e) => setData("password", e.target.value)}
                        label="Password"
                        error={errors.password}
                    />

                    {/* <TextInput
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        label="Confirm Password"
                        onChange={(e) => setData("password_confirmation", e.target.value)}
                        error={errors.password_confirmation}
                    /> */}

                    <TextInput
                        id="office_position"
                        type="text"
                        name="office_position"
                        value={data.office_position}
                        label="Office Position"
                        onChange={(e) =>
                            setData("office_position", e.target.value)
                        }
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
                            { value: "none", label: "None" },
                        ]}
                        value={data.system_role}
                        onChange={(value) =>
                            setData("system_role", value || "")
                        }
                        error={errors.system_role}
                    />
                </Stack>

                <Flex align="center" justify="end" mt={16}>
                    <Button variant="outline" onClick={handleClose}>
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

export default AddUserForm;
