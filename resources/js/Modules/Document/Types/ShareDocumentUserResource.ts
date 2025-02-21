import { UserResourceData } from "@/Modules/User/Types/UserResourceData";

export interface ShareDocumentUserResource extends UserResourceData {
    role: "viewer" | "editor";
}
