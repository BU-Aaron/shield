import React from "react";
import { ActionIcon, Box, Group } from "@mantine/core";
import { DataTable } from "mantine-datatable";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { UserResourceData } from "../Types/UserResourceData";

interface UserTableProps {
    users: UserResourceData[];
    total: number;
    perPage: number;
    page: number;
    onPageChange: (page: number) => void;
    onEdit: (user: UserResourceData) => void;
    onDelete: (user: UserResourceData) => void;
    selectedRecords: UserResourceData[];
    onSelectedRecordsChange: (records: UserResourceData[]) => void;
}

const UserTable: React.FC<UserTableProps> = ({
    users,
    total,
    perPage,
    page,
    onPageChange,
    onEdit,
    onDelete,
    selectedRecords,
    onSelectedRecordsChange,
}) => {
    return (
        <DataTable
            pinLastColumn
            withTableBorder
            shadow="xs"
            borderRadius="sm"
            withRowBorders={false}
            highlightOnHover
            verticalSpacing="lg"
            totalRecords={total}
            recordsPerPage={perPage}
            page={page}
            onPageChange={onPageChange}
            columns={[
                { accessor: "name", noWrap: true },
                { accessor: "username", noWrap: true },
                { accessor: "office_position", noWrap: true },
                {
                    accessor: "system_role",
                    title: "System Role",
                },
                {
                    accessor: "actions",
                    title: <Box mr={6}>Actions</Box>,
                    textAlign: "right",
                    render: (user) => (
                        <Group gap={8} justify="right" wrap="nowrap">
                            <ActionIcon
                                size="sm"
                                variant="subtle"
                                color="gray"
                                onClick={() => onEdit(user)}
                            >
                                <IconEdit size={20} />
                            </ActionIcon>
                            <ActionIcon
                                size="sm"
                                variant="subtle"
                                color="red"
                                onClick={() => onDelete(user)}
                            >
                                <IconTrash size={20} />
                            </ActionIcon>
                        </Group>
                    ),
                },

            ]}
            records={users}
            selectedRecords={selectedRecords}
            onSelectedRecordsChange={onSelectedRecordsChange}
        />
    );
};

export default UserTable;
