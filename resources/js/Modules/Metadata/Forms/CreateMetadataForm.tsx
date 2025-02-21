import {
    Button,
    Flex,
    Modal,
    Select,
    Stack,
    Text,
    TextInput,
} from "@mantine/core";
import { useCreateMetadata } from "../Hooks/use-create-metadata";

interface IProps {
    isOpened: boolean;
    close: () => void;
}

const CreateMetadataForm: React.FC<IProps> = ({ isOpened, close }) => {
    const {
        data,
        setData,
        handleCreateMetadata,
        processing,
        errors,
        handleClose,
    } = useCreateMetadata({ close });

    return (
        <Modal
            opened={isOpened}
            onClose={close}
            title={<Text size="lg">Create New Tag</Text>}
            size={550}
        >
            <form onSubmit={handleCreateMetadata}>
                <Stack gap={16}>
                    <TextInput
                        id="name"
                        type="text"
                        name="name"
                        value={data.name}
                        label="Name"
                        onChange={(e) => setData("name", e.target.value)}
                        error={errors.name}
                    />

                    <Select
                        label="Type"
                        placeholder="Choose Type"
                        value={data.type}
                        onChange={(_value, option) =>
                            setData("type", option.value)
                        }
                        error={errors.type}
                        data={["Text", "Number", "Yes/No"]}
                    />
                </Stack>

                <Flex align="center" justify="end" mt={16}>
                    <Button variant="light" onClick={handleClose}>
                        Cancel
                    </Button>

                    <Button ml={12} type="submit" loading={processing}>
                        Save
                    </Button>
                </Flex>
            </form>
        </Modal>
    );
};

export default CreateMetadataForm;
