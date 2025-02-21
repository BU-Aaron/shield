import { DocumentApprovalResourceData } from "@/Modules/DocumentApproval/Types/DocumentApprovalResourceData";

export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: string;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>
> = T & {
    auth: {
        user: User;
        systemRole: string;
    };
    notifications: DocumentApprovalResourceData[];
};
