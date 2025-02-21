export type DocumentUserApproval = {
    user_id: string;
    user_name: string;
    user_state: string;
    comment: string;
    created_at: string;
    updated_at: string;
};

export type DocumentApprovalResourceData = {
    id: string;
    document_id: string;
    type: string;
    destination?: string;
    resolution?: string;
    overall_state: string;
    document_user_approvals: DocumentUserApproval[];
    document_name: string;
    created_at: string;
    updated_at: string;
    is_done: boolean;
    current_user_approval_id?: string;
};
