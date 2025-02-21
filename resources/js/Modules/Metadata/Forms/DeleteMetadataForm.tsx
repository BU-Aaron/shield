import { Button, Flex, Modal, Text } from "@mantine/core";
import { useDeleteMetadata } from "../Hooks/use-delete-metadata";
import { MetadataResourceData } from "../Types/MetadataResourceData";

interface IProps {
    isOpened: boolean;
    close: () => void;
    metadata?: MetadataResourceData;
}

const DeleteMetadataForm: React.FC<IProps> = ({ isOpened, close, metadata }) => {
    const { handleDelete, processing } = useDeleteMetadata({ metadata, close });

    return (
        <Modal
            opened={isOpened}
            onClose={close}
            title={<Text size="lg">Delete Metadata</Text>}
            size={550}
        >
            <form onSubmit={handleDelete}>
                <Text c="dimmed" mt={4} size="sm">
                    Delete this metadata {metadata?.name}?
                </Text>

                <Flex align="center" justify="end" mt={16}>
                    <Button variant="subtle" color="gray" onClick={close}>
                        Cancel
                    </Button>

                    <Button ml={12} type="submit" loading={processing} color="red">
                        Confirm Delete
                    </Button>
                </Flex>
            </form>
        </Modal>
    );
};

export default DeleteMetadataForm;