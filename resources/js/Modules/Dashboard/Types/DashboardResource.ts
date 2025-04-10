export interface RecentlyUploadedDocument {
    id: string;
    name: string;
    category: string;
    review_status: string;
    approval_status: string;
    date_uploaded: string;
    mime: string;
}

export interface DashboardResource {
    number_of_documents: number;
    number_of_review_pending: number;
    number_of_review_accepted: number;
    number_of_review_rejected: number;
    number_of_approval_pending: number;
    number_of_approval_accepted: number;
    number_of_approval_rejected: number;
    recently_uploaded_documents: RecentlyUploadedDocument[];
}
