import { DocumentApprovalHasUserData } from "./DocumentApprovalHasUserData";

export type UpdateDocumentApprovalData = {
    type: string;
    resolution: string | null;
    users: DocumentApprovalHasUserData[];
};
