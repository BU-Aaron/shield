import React, { useState } from "react";
import {
    Button,
    Flex,
    Grid,
    GridCol,
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
            size={450}
        >
            <form onSubmit={submit}> 
                        <Stack gap={16}>
                            <TextInput
                                id="name"
                                type="text"
                                name="name"
                                value={data.name}
                                label="Name"
                                placeholder="Enter Name"
                                onChange={(e) => setData("name", e.target.value)}
                                error={errors.name}
                                required
                            />

                        <TextInput
                                id="username"
                                type="text"
                                name="username"
                                value={data.username}
                                label="Username"
                                placeholder="Enter Username"
                                onChange={(e) => setData("username", e.target.value)}
                                error={errors.username}
                                required
                            />
                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                label="Email"
                                placeholder="Enter Email"
                                onChange={(e) => setData("email", e.target.value)}
                                error={errors.email}
                                required
                            />

                            <TextInput
                                id="password"
                                type="text"
                                name="password"
                                placeholder="Enter Password"
                                onChange={(e) => setData("password", e.target.value)}
                                label="Password"
                                error={errors.password}
                                required
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
                                placeholder="Enter Office Position"
                                onChange={(e) =>
                                    setData("office_position", e.target.value)
                                }
                                error={errors.office_position}
                                required
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
                                    required
                            />

                            <hr style={{ margin: '1rem 0' }} />

                            <Select
                                id="security_question_id"
                                name="security_question_id"
                                label="Security Question"
                                placeholder="Select a security question"
                                data={[
                                    { value: "1", label: "What is your mother's maiden name?" },
                                    { value: "2", label: "What was the name of your first pet?" },
                                    { value: "3", label: "What is your father's name?" },
                                    { value: "4", label: "What city were you born in?" },
                                    { value: "5", label: "What was the name of your elementary school?" },
                                ]}
                                value={data.security_question_id}
                                onChange={(value) => setData("security_question_id", value || "")}
                                error={errors.security_question_id}
                                required
                            />


                            <TextInput
                                id="security_question_answer"
                                name="security_question_answer"
                                label="Your Answer"
                                placeholder="Enter your answer"
                                type="text"
                                value={data.security_question_answer}
                                onChange={(e) => setData("security_question_answer", e.target.value)}
                                error={errors.security_question_answer}
                                required
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
