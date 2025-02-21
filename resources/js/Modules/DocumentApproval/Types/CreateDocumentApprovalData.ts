import { DocumentApprovalHasUserData } from "./DocumentApprovalHasUserData";

export interface CreateDocumentApprovalData {
    document_id: string;
    type: string;
    resolution?: string;
    destination?: string;
    users: DocumentApprovalHasUserData[];
}
