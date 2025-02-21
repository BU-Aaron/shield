export interface CreateWorkflowData {
    folder_item_id: string;
    resolution: string | null;
    type: string;
    destination: string | null;
    users: { user_id: number }[];
}
