import { Button, Group } from "@mantine/core";
import { IconArchiveOff, IconTrash } from "@tabler/icons-react";
import UnarchiveFilesForm from "../Forms/UnarchiveFilesForm";
import useModalStore from "@/Modules/Common/Hooks/use-modal-store";

interface IProps {
    selectedIds: string[];
}

const ArchiveSelectedToolbar: React.FC<IProps> = ({ selectedIds }) => {
    const { openModal } = useModalStore();

    return (
        <Group h="50%" px="md" align="center" justify="flex-start">
            <Button
                variant="subtle"
                color="green.5"
                leftSection={<IconArchiveOff size={18} />}
                onClick={() => openModal("unarchiveFiles")}
            >
                Unarchive
            </Button>

            <UnarchiveFilesForm restoreIds={selectedIds} />
        </Group>
    );
};

export default ArchiveSelectedToolbar;
