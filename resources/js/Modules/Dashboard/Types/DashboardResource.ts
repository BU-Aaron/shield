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
    number_of_inv: number;
    number_of_inq: number;
    number_of_ui: number;
    recently_uploaded_documents: RecentlyUploadedDocument[];
}
