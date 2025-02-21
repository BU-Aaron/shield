import { FileWithPath } from "@mantine/dropzone";

export type UploadDocumentVersionData = {
    document_item_id: string;
    file: FileWithPath | null;
};
