import { FolderRequiredMetadataResource } from "@/Modules/Folder/Types/FolderRequiredMetadataResource";
import { DocumentMetadata } from "./DocumentMetadata";
import { DocumentVersionResourceData } from "./DocumentVersionResourceData";

export type DocumentResourceData = {
    item_id: string;
    name: string;
    mime: string;
    document_number?: string;
    review_status?: string;
    approval_status: string;
    description?: string;
    due_date?: string;
    file_path?: string;
    document_approval_ids?: {
        id: string;
        type: string;
    }[];
    related_documents: Array<{
        id: string;
        item_id: string;
        name: string;
    }>;
    metadata: DocumentMetadata[];
    required_folder_metadata: FolderRequiredMetadataResource[];
    versions: DocumentVersionResourceData[];
    created_at: string;
    updated_at: string;
    archived_at: string;
};
