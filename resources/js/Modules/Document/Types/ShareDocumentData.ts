export interface ShareDocumentUserData {
    email: string;
    role: 'viewer' | 'editor';
}

export interface ShareDocumentData {
    users: ShareDocumentUserData[];
}
