import { Head } from "@inertiajs/react";
import {
    ActionIcon,
    Button,
    Flex,
    Group,
    Stack,
    Text,
    Textarea,
    TextInput,
} from "@mantine/core";
import { Authenticated } from "@/Modules/Common/Layouts/AuthenticatedLayout/Authenticated";
import {
    IconEdit,
    IconFile,
    IconFolder,
    IconPlus,
    IconTrash,
} from "@tabler/icons-react";
import { FolderResourceData } from "@/Modules/Folder/Types/FolderResourceData";
import { ItemAncestorsResourceData } from "@/Modules/Item/Types/ItemAncestorsResourceData";
import ItemBreadcrumbs from "@/Modules/Item/Components/ItemBreadcrumbs";

interface IProps {
    folder: FolderResourceData;
    itemAncestors: ItemAncestorsResourceData[];
}

export default function FolderPropertiesPage({
    folder,
    itemAncestors,
}: IProps) {
    return (
        <Authenticated>
            <Head title={folder.name} />
            <Stack px={8} py={8} gap={24} w={550} mb={72}>
                <ItemBreadcrumbs ancestors={itemAncestors} />

                <Group mt={24}>
                    <IconFolder
                        size={56}
                        fill="orange"
                        stroke="none"
                        color="none"
                    />
                    <Text fw={500}>{folder.name}</Text>
                    <ActionIcon variant="subtle" color="gray">
                        <IconEdit size={24} />
                    </ActionIcon>
                </Group>

                <Textarea
                    label="Notes"
                    autosize
                    minRows={4}
                    maxRows={6}
                    defaultValue={"This is a note, todo make field for notes"}
                />

                <Flex align="center" justify="end" mt={16}>
                    <Button variant="outline" onClick={close}>
                        Cancel
                    </Button>

                    <Button ml={12} type="submit">
                        Save
                    </Button>
                </Flex>
            </Stack>
        </Authenticated>
    );
}
