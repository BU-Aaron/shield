import axios from "axios";
import { useState, useEffect } from "react";
import { WorkflowResource } from "../Types/WorkflowResource";

interface IProps {
    workflowId?: number;
    isOpen: boolean;
}

export function useFetchWorkflow({ workflowId, isOpen }: IProps) {
    const [workflow, setWorkflow] = useState<WorkflowResource | null>(null);

    useEffect(() => {
        if (workflowId && isOpen) {
            fetchWorkflow(workflowId);
        }
    }, [workflowId, isOpen]);

    const fetchWorkflow = async (workflowId: number) => {
        try {
            const response = await axios.get(`/workflows/${workflowId}`);
            setWorkflow(response.data);
        } catch (error) {
            console.error("Error fetching workflow", error);
        }
    };

    return workflow;
}
