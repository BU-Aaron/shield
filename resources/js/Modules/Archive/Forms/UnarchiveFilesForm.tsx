import React from "react";
import { Button, Flex, Modal, Text } from "@mantine/core";
import useModalStore from "@/Modules/Common/Hooks/use-modal-store";
import { useUnarchiveFiles } from "../Hooks/use-unarchive-files";

interface UnarchiveFilesFormProps {
    restoreIds: string[];
}

const UnarchiveFilesForm: React.FC<UnarchiveFilesFormProps> = ({
    restoreIds,
}) => {
    const { unarchiveFilesSubmit, processing } = useUnarchiveFiles({
        restoreIds,
    });
    const { modals, closeModal } = useModalStore();

    return (
        <Modal
            opened={modals["unarchiveFiles"]}
            onClose={() => closeModal("unarchiveFiles")}
            title={
                <Text fw="bold" size="lg">
                    Unarchive Files
                </Text>
            }
            size={550}
        >
            <form onSubmit={unarchiveFilesSubmit}>
                <Text c="dimmed">
                    Are you sure you want to unarchive the selected files?
                </Text>
                <Flex align="center" justify="end" mt={16}>
                    <Button
                        variant="subtle"
                        onClick={() => closeModal("unarchiveFiles")}
                        color="gray"
                    >
                        Cancel
                    </Button>
                    <Button
                        ml={12}
                        type="submit"
                        loading={processing}
                        color="green.5"
                    >
                        Unarchive
                    </Button>
                </Flex>
            </form>
        </Modal>
    );
};

export default UnarchiveFilesForm;
