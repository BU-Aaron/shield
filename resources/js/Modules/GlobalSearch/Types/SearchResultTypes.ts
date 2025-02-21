export type DocumentSearchResult = {
    id: string;
    name: string;
    document_number: string;
    mime: string;
    type: string;
    status: string;
    missing_required_metadata: boolean;
    metadata: {
        metadata_id: number;
        name: string;
        value: string;
    }[];
}

export type FolderSearchResult = {
    id: number;
    name: string;
    metadata: string[];
}

export type SearchResults = {
    documents: DocumentSearchResult[];
    query: string;
}