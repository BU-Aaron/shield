import { useForm } from "@inertiajs/react";
import { notifications } from "@mantine/notifications";

export default function useRestoreDocumentVersion() {
    const { post, processing } = useForm();

    const restoreVersion = (versionId: string) => {
        post(route("document.restore_version", { version: versionId }), {
            onSuccess: () => {
                notifications.show({
                    position: "top-center",
                    message: "Document version restored successfully.",
                    color: "green",
                });
            },
            onError: () => {
                notifications.show({
                    position: "top-center",
                    message: "Failed to restore document version.",
                    color: "red",
                });
            },
        });
    };

    return { restoreVersion, processing };
}
