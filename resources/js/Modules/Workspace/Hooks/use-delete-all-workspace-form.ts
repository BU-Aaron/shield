import { useForm } from "@inertiajs/react";

export function useDeleteAllWorkspaces() {
    const { delete: destroy, processing } = useForm();

    const deleteAll = () => {
        destroy("/workspaces");
    };

    return { deleteAll, processing };
}