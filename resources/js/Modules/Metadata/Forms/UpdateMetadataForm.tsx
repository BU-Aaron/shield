import {
    Button,
    Flex,
    Modal,
    Select,
    Stack,
    Text,
    TextInput,
    Group,
    ActionIcon,
} from "@mantine/core";
import { useUpdateMetadata } from "../Hooks/use-update-metadata";
import {
    MetadataResourceData,
    MetadataPredefinedValue,
} from "../Types/MetadataResourceData";
import { IconPlus, IconTrash } from "@tabler/icons-react";

interface IProps {
    isOpened: boolean;
    close: () => void;
    metadata?: MetadataResourceData;
}

const UpdateMetadataForm: React.FC<IProps> = ({
    isOpened,
    close,
    metadata,
}) => {
    const { data, setData, handleEdit, processing, errors } = useUpdateMetadata(
        { metadata, close }
    );

    const handleAddPredefinedValue = () => {
        setData("predefined_values", [
            ...(data.predefined_values || []),
            { id: Date.now(), predefined_value: "" },
        ]);
    };

    const handleDeletePredefinedValue = (id: number) => {
        setData(
            "predefined_values",
            data.predefined_values?.filter((val) => val.id !== id)
        );
    };

    const handlePredefinedValueChange = (id: number, value: string) => {
        const updatedValues = data.predefined_values?.map((val) =>
            val.id === id ? { ...val, predefined_value: value } : val
        );
        setData("predefined_values", updatedValues);
    };

    return (
        <Modal
            opened={isOpened}
            onClose={close}
            title={<Text size="lg">Edit Metadata</Text>}
            size={550}
        >
            <form onSubmit={handleEdit}>
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
                        data={["Text", "Yes/No", "Number"]}
                    />

                    {/* Predefined Values Section */}
                    <Stack>
                        <Flex justify="space-between" align="center">
                            <Text size="sm" fw={500}>
                                Predefined Values
                            </Text>
                            <Button
                                variant="light"
                                leftSection={<IconPlus size={14} />}
                                onClick={handleAddPredefinedValue}
                            >
                                Add Predefined Value
                            </Button>
                        </Flex>

                        {data.predefined_values &&
                            data.predefined_values.map(
                                (val: MetadataPredefinedValue) => (
                                    <Group
                                        key={val.id}
                                        justify="space-between"
                                        align="flex-end"
                                    >
                                        <TextInput
                                            placeholder="Predefined value"
                                            value={val.predefined_value}
                                            onChange={(e) =>
                                                handlePredefinedValueChange(
                                                    val.id,
                                                    e.target.value
                                                )
                                            }
                                            required
                                            style={{ flex: 1 }}
                                        />
                                        <ActionIcon
                                            color="red"
                                            onClick={() =>
                                                handleDeletePredefinedValue(
                                                    val.id
                                                )
                                            }
                                        >
                                            <IconTrash size={16} />
                                        </ActionIcon>
                                    </Group>
                                )
                            )}
                    </Stack>
                </Stack>

                <Flex align="center" justify="end" mt={16}>
                    <Button variant="outline" onClick={close}>
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

export default UpdateMetadataForm;
