import { DataTable } from "mantine-datatable";
import { ActivityLogResourceData } from "../Types/ActivityLogResourceData";

interface ActivityLogTableProps {
    records: ActivityLogResourceData[];
    totalRecords: number;
    recordsPerPage: number;
    page: number;
    onPageChange: (page: number) => void;
}

const ActivityLogTable: React.FC<ActivityLogTableProps> = ({
    records,
    totalRecords,
    recordsPerPage,
    page,
    onPageChange,
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
            horizontalSpacing="xl"
            totalRecords={totalRecords}
            recordsPerPage={recordsPerPage}
            page={page}
            onPageChange={onPageChange}
            columns={[
                { accessor: "date", title: "Date", noWrap: true },
                { accessor: "time", title: "Time" },
                { accessor: "user_name", title: "User" },
                { accessor: "subject_type", title: "Object Type" },
                { accessor: "subject_name", title: "Object" },
                { accessor: "description", title: "Action", width: 250 },
            ]}
            records={records}
        />
    );
};

export default ActivityLogTable;
