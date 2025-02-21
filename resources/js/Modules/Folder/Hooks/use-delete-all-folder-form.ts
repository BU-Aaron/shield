import { useForm } from "@inertiajs/react";

export function useDeleteAllFolders() {
    const { delete: destroy, processing } = useForm();

    const deleteAll = () => {
        destroy("/folders");
    };

    return { deleteAll, processing };
}