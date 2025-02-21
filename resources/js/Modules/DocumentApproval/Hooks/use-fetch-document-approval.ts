import axios from "axios";
import { useState, useEffect } from "react";
import { DocumentApprovalResourceData } from "../Types/DocumentApprovalResourceData";

interface IProps {
    documentApprovalId?: string;
    isOpen: boolean;
}

export function useFetchDocumentApproval({ documentApprovalId, isOpen }: IProps) {
    const [documentApproval, setDocumentApproval] = useState<DocumentApprovalResourceData | null>(null);

    useEffect(() => {
        if (documentApprovalId && isOpen) {
            fetchDocumentApproval(documentApprovalId);
        }
    }, [documentApprovalId, isOpen]);

    const fetchDocumentApproval = async (documentApprovalId: string) => {
        try {
            const response = await axios.get(`/document_approval/${documentApprovalId}/update`);
            setDocumentApproval(response.data);
        } catch (error) {
            console.error("Error fetching document approval", error);
        }
    };

    return documentApproval;
}
