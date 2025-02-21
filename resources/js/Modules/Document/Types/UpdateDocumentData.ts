import { DocumentMetadata } from "./DocumentMetadata";

export interface UpdateDocumentData {
    name: string;
    document_number?: string;
    description?: string;
    due_date?: string;
    update_metadata?: DocumentMetadata[];
    delete_metadata?: DocumentMetadata[];
    related_documents?: Array<{
        item_id: string;
        name: string;
    }>;
}