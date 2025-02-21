import { Modal, Text, TextInput, Button, Stack, Flex, NumberInput, Select, Group, Paper, ActionIcon, Switch } from "@mantine/core";
import { useState, useEffect } from "react";
import { NumberingSchemeResourceData } from "../Types/NumberingSchemeResourceData";
import useModalStore from "@/Modules/Common/Hooks/use-modal-store";
import { ItemParentResourceData } from "@/Modules/Item/Types/ItemParentResourceData";
import { useCreateNumberingScheme } from "../Hooks/use-create-numbering-scheme";
import { IconPlus, IconTrash } from "@tabler/icons-react";

interface IProps {
    itemParent?: ItemParentResourceData;
}

type PrefixPart = {
    id: number;
    type: 'text' | 'dynamic';
    value: string;
};

const CreateNumberingSchemeForm: React.FC<IProps> = ({ itemParent }) => {
    const { data, setData, handleSubmit, processing, errors } = useCreateNumberingScheme({
        itemParent,
    });

    const { modals, closeModal } = useModalStore();

    const [prefixParts, setPrefixParts] = useState<PrefixPart[]>([]);

    // Update the form data when prefixParts change
    useEffect(() => {
        const prefixString = prefixParts.map(part => {
            if (part.type === 'text') {
                return `{${part.value}}`;
            } else {
                // Represent dynamic parts with placeholders
                return `[${part.value}]`;
            }
        }).join(' ');
        setData("prefix", prefixString);
    }, [prefixParts]);

    // Function to add a text part
    const addTextPart = () => {
        setPrefixParts([...prefixParts, { id: Date.now(), type: 'text', value: '' }]);
    };

    // Function to add a dynamic part
    const addDynamicPart = () => {
        setPrefixParts([...prefixParts, { id: Date.now(), type: 'dynamic', value: '' }]);
    };

    // Function to update a part's value
    const updatePart = (id: number, value: string) => {
        setPrefixParts(prefixParts.map(part => part.id === id ? { ...part, value } : part));
    };

    // Function to remove a part
    const removePart = (id: number) => {
        setPrefixParts(prefixParts.filter(part => part.id !== id));
    };

    // Predefined dynamic options
    const dynamicOptions = [
        { value: 'YY', label: 'Year' },
        { value: 'MM', label: 'Month' },
        { value: 'DD', label: 'Day' },
        { value: 'INC', label: 'Increment' },
    ];

    return (
        <Modal
            opened={modals["createNumberingScheme"]}
            onClose={() => closeModal("createNumberingScheme")}
            title={<Text size="lg">Create Numbering Scheme</Text>}
            size={600}
        >
            <form onSubmit={handleSubmit}>
                <Stack gap={16}>
                    <TextInput
                        label="Name"
                        value={data.name}
                        onChange={(e) => setData("name", e.target.value)}
                        error={errors.name}
                        required
                    />

                    <Switch
                        label="Add Number Only If Approved"
                        checked={data.add_if_approved}
                        onChange={(event) => setData("add_if_approved", event.currentTarget.checked)}
                        mt="md"
                    />

                    <Text size="sm" fw={500}>Prefix Builder</Text>
                    <Group>
                        <Button variant="subtle" size="sm" leftSection={<IconPlus size={16} />} onClick={addTextPart}>
                            Add Text
                        </Button>
                        <Button variant="subtle" size="sm" leftSection={<IconPlus size={16} />} onClick={addDynamicPart}>
                            Add Dynamic
                        </Button>
                    </Group>

                    {prefixParts.map((part, index) => (
                        <Group key={part.id} align="flex-end">
                            {part.type === 'text' ? (
                                <TextInput
                                    placeholder="Enter text"
                                    value={part.value}
                                    onChange={(e) => updatePart(part.id, e.target.value)}
                                    required
                                    style={{ flex: 1 }}
                                />
                            ) : (
                                <Select
                                    placeholder="Select dynamic part"
                                    data={dynamicOptions}
                                    value={part.value}
                                    onChange={(value) => updatePart(part.id, value || '')}
                                    required
                                    style={{ flex: 1 }}
                                />
                            )}
                            <ActionIcon color="red" onClick={() => removePart(part.id)}>
                                <IconTrash size={16} />
                            </ActionIcon>
                        </Group>
                    ))}

                    <Text size="sm" fw={500}>Preview:</Text>
                    <Paper withBorder p={12} bg="#f9f9f9">
                        <Text>{prefixParts.map(part => {
                            if (part.type === 'text') {
                                return part.value + ' ';
                            } else {
                                // Replace dynamic parts with sample values
                                switch (part.value) {
                                    case 'YY':
                                        return new Date().getFullYear().toString().slice(2) + ' ';
                                    case 'MM':
                                        return (new Date().getMonth() + 1).toString().padStart(2, '0') + ' ';
                                    case 'DD':
                                        return new Date().getDate().toString().padStart(2, '0') + ' ';
                                    case 'INC':
                                        return data.next_number.toString() + ' ';
                                    default:
                                        return '';
                                }
                            }
                        }).join('').trim()}</Text>
                    </Paper>

                    <Group justify="space-between">
                        <NumberInput
                            label="Next Number"
                            value={data.next_number}
                            onChange={(value) => setData("next_number", Number(value))}
                            min={1}
                            error={errors.next_number}
                            required
                            style={{ flex: 1 }}
                        />
                    </Group>

                    <Select
                        label="Reset Frequency"
                        data={[
                            { value: 'none', label: 'None' },
                            { value: 'monthly', label: 'Monthly' },
                            { value: 'yearly', label: 'Yearly' },
                        ]}
                        value={data.reset_frequency}
                        onChange={(value) => setData("reset_frequency", value ?? 'none')}
                        error={errors.reset_frequency}
                        required
                    />
                </Stack>
                <Flex align="center" justify="end" mt={24}>
                    <Button variant="light" onClick={() => closeModal("createNumberingScheme")}>
                        Cancel
                    </Button>
                    <Button ml={12} type="submit" loading={processing}>
                        Create
                    </Button>
                </Flex>
            </form>
        </Modal>
    );
};

export default CreateNumberingSchemeForm;
