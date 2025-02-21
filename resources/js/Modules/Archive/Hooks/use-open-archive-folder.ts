import { router } from "@inertiajs/react";

interface UseOpenArchiveFolder {
    openArchiveFolder: (type?: string, id?: string) => void;
}

export function useOpenArchiveFolder(): UseOpenArchiveFolder {
    const openArchiveFolder = (type?: string, id?: string) => {
        if (type !== "folder") {
            return;
        }
        router.visit(route("archive.show", { id }));
    };

    return { openArchiveFolder };
}
