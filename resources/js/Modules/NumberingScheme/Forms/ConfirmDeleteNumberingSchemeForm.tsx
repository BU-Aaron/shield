import { Button, Flex, Modal, Text } from "@mantine/core";
import { useDeleteNumberingScheme } from "../Hooks/use-delete-numbering-scheme";
import useModalStore from "@/Modules/Common/Hooks/use-modal-store";

interface ConfirmDeleteNumberingSchemeProps {
    numberingSchemeId?: number;
}

const ConfirmDeleteNumberingSchemeForm: React.FC<ConfirmDeleteNumberingSchemeProps> = ({ numberingSchemeId }) => {
    const { modals, closeModal, openModal } = useModalStore();
    const isOpen = modals["confirmDeleteNumberingScheme"];

    const { handleDeleteNumberingScheme, processing } = useDeleteNumberingScheme({
        numberingSchemeId,
        onDeleteSuccess: () => {
            closeModal("confirmDeleteNumberingScheme");
            closeModal("updateNumberingScheme");
        },
    });

    return (
        <Modal
            opened={isOpen}
            onClose={() => closeModal("confirmDeleteNumberingScheme")}
            title={<Text fw="bold" size="lg">Confirm Delete</Text>}
            size="sm"
        >
            <Text c="gray.8">Are you sure you want to delete this numbering scheme? This action cannot be undone.</Text>
            <Flex align="center" justify="flex-end" mt={16}>
                <Button variant="light" onClick={() => {
                    closeModal("confirmDeleteNumberingScheme");
                    openModal("updateNumberingScheme");
                }}>
                    Cancel
                </Button>
                <Button
                    color="red"
                    ml={12}
                    onClick={handleDeleteNumberingScheme}
                    loading={processing}
                >
                    Delete
                </Button>
            </Flex>
        </Modal>
    );
};

export default ConfirmDeleteNumberingSchemeForm; 