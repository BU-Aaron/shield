import { UserResourceData } from "@/Modules/User/Types/UserResourceData";

export interface WorkflowResource {
    id: number;
    type: string;
    resolution: string | null;
    destination: string | null;
    users: UserResourceData[];
}
