import { FolderRequiredMetadataResource } from "@/Modules/Folder/Types/FolderRequiredMetadataResource";
import { MetadataResourceData } from "@/Modules/Metadata/Types/MetadataResourceData";

export type ItemParentResourceData = {
    item_id: string;
    parent_id: string;
    name: string;
    description?: string;
    owned_by: string;
    numbering_scheme_id?: number;
    workflow_id?: number;
    is_shared?: boolean;
    required_metadata?: FolderRequiredMetadataResource[];
    metadata_columns?: MetadataResourceData[];
};
