import { router } from "@inertiajs/react";

interface UseDocumentProperties {
    openDocument: (id?: string) => void;
}

export function useDocumentProperties(): UseDocumentProperties {
    const openDocument = (id?: string) => {
        router.visit(route("document.show", { document: id }));
    };

    return { openDocument };
}