import React from "react";
import { Button, Flex, Modal, Text } from "@mantine/core";
import { useRestoreFiles } from "@/Modules/Trash/Hooks/use-restore-files";
import useModalStore from "@/Modules/Common/Hooks/use-modal-store";

interface RestoreModalProps {
    restoreIds?: string[];
}

const RestoreFilesForm: React.FC<RestoreModalProps> = ({ restoreIds }) => {
    const { data, setData, restoreFilesSubmit, processing } = useRestoreFiles();
    const { modals, closeModal } = useModalStore();

    React.useEffect(() => {
        setData({ ids: restoreIds || [] });
    }, [restoreIds, setData]);

    return (
        <Modal
            opened={modals["restoreFiles"]}
            onClose={() => closeModal("restoreFiles")}
            title={
                <Text fw="bold" size="lg">
                    Restore Files
                </Text>
            }
            size={550}
        >
            <form onSubmit={restoreFilesSubmit}>
                <Text c="dimmed">Restore selected files?</Text>

                <Flex align="center" justify="end" mt={16}>
                    <Button variant="subtle" onClick={() => closeModal("restoreFiles")} color="gray">
                        Cancel
                    </Button>

                    <Button
                        ml={12}
                        type="submit"
                        loading={processing}
                        color="green"
                    >
                        Confirm Restore
                    </Button>
                </Flex>
            </form>
        </Modal>
    );
};

export default RestoreFilesForm;