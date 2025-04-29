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
            size={950}
        >
            <form onSubmit={submit}>
                <Grid gutter={24}> 
                    <GridCol span={6}> 
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
                                placeholder="Enter Office Position"
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
                    </GridCol>
                    
                    {/*<GridCol span={6}>
                        <Stack gap={16}>
                            <TextInput
                                id="sec_answer_1"
                                type="text"
                                name="sec_answer_1"
                                value={data.sec_answer_1}
                                label="Security Question 1"
                                placeholder="What was your childhood nickname?"
                                onChange={(e) =>
                                    setData("sec_answer_1", e.target.value)
                                }
                                error={errors.sec_answer_1}
                            />

                            <TextInput
                                id="sec_answer_2"
                                type="text"
                                name="sec_answer_2"
                                value={data.sec_answer_2}
                                label="Security Question 2"
                                placeholder="What is the name of your favorite childhood friend??"
                                onChange={(e) =>
                                    setData("sec_answer_2", e.target.value)
                                }
                                error={errors.sec_answer_2}
                            />

                            <TextInput
                                id="sec_answer_3"
                                type="text"
                                name="sec_answer_3"
                                value={data.sec_answer_3}
                                label="Security Question 3"
                                placeholder="What was your dream job as a child?"
                                onChange={(e) =>
                                    setData("sec_answer_3", e.target.value)
                                }
                                error={errors.sec_answer_3}
                            />

                            <TextInput
                                id="sec_answer_4"
                                type="text"
                                name="sec_answer_4"
                                value={data.sec_answer_4}
                                label="Security Question 4"
                                placeholder="What is the name of your first pet?"
                                onChange={(e) =>
                                    setData("sec_answer_4", e.target.value)
                                }
                                error={errors.sec_answer_4}
                            />

                            <TextInput
                                id="sec_answer_5"
                                type="text"
                                name="sec_answer_5"
                                value={data.sec_answer_5}
                                label="Security Question 5"
                                placeholder="What is your mother's maiden name?"
                                onChange={(e) =>
                                    setData("sec_answer_5", e.target.value)
                                }
                                error={errors.sec_answer_5}
                            />
                        </Stack>                               
                    </GridCol> */}
                </Grid>

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
