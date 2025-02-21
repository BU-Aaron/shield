export interface MetadataFilter {
    field: string;
    operator: string;
    value: string;
}

export interface DashboardReportFilters {
    document_status: string | null;
    start_date: string | null;
    end_date: string | null;
    uploader: string | null;
    due_in: string | null;
    metadata_filters: MetadataFilter[];
}
