import { router } from "@inertiajs/react";

interface UseOpenFolder {
    openFolder: (type?: string, id?: string) => void;
}

export function useOpenFolder(): UseOpenFolder {
    const openFolder = (type?: string, id?: string) => {
        if (type !== "folder") {
            return;
        }
        router.visit(route("folder.show", { id }));
    };

    return { openFolder };
}