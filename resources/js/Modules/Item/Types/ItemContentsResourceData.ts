import { MetadataResourceData } from "@/Modules/Metadata/Types/MetadataResourceData";

export type ItemContentsResourceData = {
    id: string;
    owned_by?: string;
    name?: string;
    mime?: string;
    size?: string;
    type?: string;
    document_number?: string;
    review_status?: string;
    approval_status?: string;
    description?: string;
    updated_at?: string;
    due_in?: string;
    file_path?: string;
    missing_required_metadata?: boolean; // TODO: make logic to check if the document is missing required metadata
    metadata?: MetadataResourceData[];
};
