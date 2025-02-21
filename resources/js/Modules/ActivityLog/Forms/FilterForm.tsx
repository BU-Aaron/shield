import React, { useState } from "react";
import { Button, Flex, Modal, Select, Stack, Text } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { IconFilter } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { router } from "@inertiajs/react";
import { UserResourceData } from "../Types/UserResourceData";
import { ObjectTypeResourceData } from "../Types/ObjectTypeResourceData";

interface FilterFormProps {
    users: UserResourceData[];
    objectTypes: ObjectTypeResourceData[];
}

const FilterForm: React.FC<FilterFormProps> = ({ users, objectTypes }) => {
    const [opened, { open, close }] = useDisclosure(false);
    const [selectedUser, setSelectedUser] = useState<string | null>(null);
    const [selectedObjectType, setSelectedObjectType] = useState<string | null>(null);
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const query: Record<string, any> = {};

        if (selectedUser) {
            query.user_id = selectedUser;
        }

        if (selectedObjectType) {
            query.object_type = selectedObjectType;
        }

        if (startDate && endDate) {
            query.start_date = startDate.toISOString().split('T')[0];
            query.end_date = endDate.toISOString().split('T')[0];
        }

        router.get('/activity-log', query, { replace: true, preserveState: true });
        close();
    };

    const handleReset = () => {
        setSelectedUser(null);
        setSelectedObjectType(null);
        setStartDate(null);
        setEndDate(null);
        router.get('/activity-log', {}, { replace: true, preserveState: true });
        close();
    };

    return (
        <>
            <Button
                variant="subtle"
                color="dark.3"
                leftSection={<IconFilter size={18} />}
                onClick={open}
            >
                Filter
            </Button>

            <Modal
                opened={opened}
                onClose={close}
                title={
                    <Text fw="bold" size="lg">
                        Filter Activity Log
                    </Text>
                }
                size="550"
            >
                <form onSubmit={handleSubmit}>
                    <Stack gap={16}>
                        <Select
                            label="User"
                            placeholder="Select a user"
                            data={users.map(user => ({ value: user.id.toString(), label: user.name }))}
                            value={selectedUser}
                            onChange={setSelectedUser}
                            clearable
                        />

                        <Select
                            label="Object Type"
                            placeholder="Select object type"
                            data={objectTypes.map(obj => ({ value: obj.value, label: obj.label }))}
                            value={selectedObjectType}
                            onChange={setSelectedObjectType}
                            clearable
                        />

                        <Flex gap={16}>
                            <DatePickerInput
                                label="Start Date"
                                placeholder="Select start date"
                                value={startDate}
                                onChange={setStartDate}
                                maxDate={endDate || undefined}
                            />
                            <DatePickerInput
                                label="End Date"
                                placeholder="Select end date"
                                value={endDate}
                                onChange={setEndDate}
                                minDate={startDate || undefined}
                            />
                        </Flex>
                    </Stack>

                    <Flex align="center" justify="space-between" mt={16}>
                        <Button variant="outline" color="gray" onClick={handleReset}>
                            Reset Filters
                        </Button>

                        <Button ml={12} type="submit">
                            Apply Filters
                        </Button>
                    </Flex>
                </form>
            </Modal>
        </>
    );
};

export default FilterForm;