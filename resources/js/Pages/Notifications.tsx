import React from "react";
import { Head, router } from "@inertiajs/react";
import { Authenticated } from "@/Modules/Common/Layouts/AuthenticatedLayout/Authenticated";
import {
    Group,
    Text,
    Badge,
    Stack,
} from "@mantine/core";
import { DocumentApprovalResourceData } from "@/Modules/DocumentApproval/Types/DocumentApprovalResourceData";
import { DataTable } from 'mantine-datatable';
import { useDocumentProperties } from "@/Modules/Item/Hooks/use-document-properties";
import { ItemIcon } from "@/Modules/Common/Components/ItemIcon/ItemIcon";

interface NotificationsPageProps {
    notifications: DocumentApprovalResourceData[];
}

const NotificationsPage: React.FC<NotificationsPageProps> = ({ notifications }) => {
    return (
        <Authenticated>
            <Head title="Notifications" />
            <Stack px={8} py={8} gap={24}>
                <Text component="h2" size="xl" fw={600} color="gray.8">
                    Your Pending Approvals
                </Text>

                {notifications.length > 0 ? (
                    <DataTable
                        columns={[
                            {
                                accessor: "document_name",
                                title: "Document",
                                render: ({ type, document_name, overall_state }) => (
                                    <Group align="center" gap={12}>
                                        <ItemIcon
                                            mime="application/pdf" // Assuming all documents are PDFs; adjust as needed
                                            isFolder={type === 'document'}
                                            approvalStatus={overall_state}
                                        />
                                        <span>{document_name}</span>
                                    </Group>
                                ),
                            },
                            {
                                accessor: "overall_state",
                                title: "Status",
                                render: ({ overall_state }) => {
                                    let color = 'gray';
                                    let label = overall_state.charAt(0).toUpperCase() + overall_state.slice(1);

                                    switch (overall_state) {
                                        case 'accepted':
                                            color = 'green';
                                            break;
                                        case 'rejected':
                                            color = 'red';
                                            break;
                                        case 'pending':
                                            color = 'yellow';
                                            break;
                                        default:
                                            color = 'gray';
                                    }

                                    return <Badge color={color} variant="light">{label}</Badge>;
                                },
                            },
                            {
                                accessor: "created_at",
                                title: "Created At",
                                render: ({ created_at }) => new Date(created_at).toLocaleString(),
                            },
                        ]}
                        records={notifications}
                        highlightOnHover
                        verticalSpacing="lg"
                        horizontalSpacing="xl"
                        textSelectionDisabled
                        customRowAttributes={({ type, id }) => ({
                            onClick: (e: MouseEvent) => {
                                if (e.button === 0) {
                                    router.visit(route('document_approvals.show', { documentApproval: id }));
                                }
                            },
                            style: { cursor: 'pointer' },
                        })}
                    />
                ) : (
                    <Text size="md" color="dimmed">
                        You have no pending approvals.
                    </Text>
                )}
            </Stack>
        </Authenticated>
    );
};

export default NotificationsPage;
