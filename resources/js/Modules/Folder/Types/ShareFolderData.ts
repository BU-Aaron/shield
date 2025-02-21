export interface ShareFolderUserData {
    email: string;
    role: 'viewer' | 'editor';
}

export interface ShareFolderData {
    users: ShareFolderUserData[];
}
