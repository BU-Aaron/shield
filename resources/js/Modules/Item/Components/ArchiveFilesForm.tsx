import React from "react";
import { Button, Flex, Modal, Text } from "@mantine/core";
import useModalStore from "@/Modules/Common/Hooks/use-modal-store";
import { useArchiveFiles } from "@/Modules/Item/Hooks/use-archive-files";
interface ArchiveFilesFormProps {
    selectedIds: string[];
    setSelectedRecord: (record: any[]) => void;
}

const ArchiveFilesForm: React.FC<ArchiveFilesFormProps> = ({
    selectedIds,
    setSelectedRecord,
}) => {
    const { archiveFilesSubmit, processing } = useArchiveFiles({
        selectedIds,
        setSelectedRecord,
    });
    const { modals, closeModal } = useModalStore();

    return (
        <Modal
            opened={modals["archiveFiles"]}
            onClose={() => closeModal("archiveFiles")}
            title={
                <Text fw="bold" size="lg">
                    Archive Files
                </Text>
            }
            size={550}
        >
            <form onSubmit={archiveFilesSubmit}>
                <Text c="dimmed">
                    Are you sure you want to archive the selected files?
                </Text>
                <Flex align="center" justify="end" mt={16}>
                    <Button
                        variant="subtle"
                        onClick={() => closeModal("archiveFiles")}
                        color="gray"
                    >
                        Cancel
                    </Button>
                    <Button
                        ml={12}
                        type="submit"
                        loading={processing}
                        color="blue.5"
                    >
                        Archive
                    </Button>
                </Flex>
            </form>
        </Modal>
    );
};

export default ArchiveFilesForm;
