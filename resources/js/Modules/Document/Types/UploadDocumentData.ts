import { FileWithPath } from "@mantine/dropzone";

export type UploadDocumentData = {
    parent_id: string;
    files?: { file: FileWithPath }[];
};
