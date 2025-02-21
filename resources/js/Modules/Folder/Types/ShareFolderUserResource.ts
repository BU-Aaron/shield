import { UserResourceData } from "@/Modules/User/Types/UserResourceData";

export interface ShareFolderUserResource extends UserResourceData {
    role: "viewer" | "editor";
}