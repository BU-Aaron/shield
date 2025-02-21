import { DataTable } from "mantine-datatable";
import { NumberingSchemeResourceData } from "../Types/NumberingSchemeResourceData";
import { ActionIcon, Group, Tooltip } from "@mantine/core";
import { IconEdit } from "@tabler/icons-react";

interface NumberingSchemeTableProps {
    records: NumberingSchemeResourceData[];
    totalRecords: number;
    recordsPerPage: number;
    page: number;
    onPageChange: (page: number) => void;
    selectedRecords: NumberingSchemeResourceData[];
    onSelectedRecordsChange: (records: NumberingSchemeResourceData[]) => void;
    onEdit: (scheme: NumberingSchemeResourceData) => void;
}

const NumberingSchemeTable: React.FC<NumberingSchemeTableProps> = ({
    records,
    totalRecords,
    recordsPerPage,
    page,
    onPageChange,
    selectedRecords,
    onSelectedRecordsChange,
    onEdit,
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
            totalRecords={totalRecords}
            recordsPerPage={recordsPerPage}
            page={page}
            onPageChange={onPageChange}
            columns={[
                { accessor: "name", title: "Name", noWrap: true },
                { accessor: "description", title: "Description", noWrap: true },
                { accessor: "folder_name", title: "Folder", noWrap: true },
                {
                    accessor: "actions",
                    title: "Actions",
                    sortable: false,
                    render: (record) => (
                        <Tooltip label="Edit" withArrow>
                            <ActionIcon onClick={() => onEdit(record)} color="blue">
                                <IconEdit size={16} />
                            </ActionIcon>
                        </Tooltip>
                    ),
                },
            ]}
            records={records}
            selectedRecords={selectedRecords}
            onSelectedRecordsChange={onSelectedRecordsChange}
        />
    );
};

export default NumberingSchemeTable;