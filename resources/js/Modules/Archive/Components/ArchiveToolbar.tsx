import { Button, Group } from "@mantine/core";
import { IconSettings } from "@tabler/icons-react";
import useModalStore from "@/Modules/Common/Hooks/use-modal-store";
import ArchiveOptionsForm from "./ArchiveOptionsForm";

const ArchiveToolbar: React.FC = () => {
    const { openModal } = useModalStore();

    return (
        <Group h="50%" px="md" align="center" justify="flex-start">
            <Button
                variant="subtle"
                color="dark.3"
                leftSection={<IconSettings size={18} />}
                onClick={() => openModal("archiveOptions")}
            >
                Archive Options
            </Button>

            <ArchiveOptionsForm />
        </Group>
    );
};

export default ArchiveToolbar;
