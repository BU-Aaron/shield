export interface NotificationResource {
    id: string;
    document_id: string | null;
    document_approval_id: string | null;
    message: string;
    workflow_type: string;
    date: string;
}