import React, { useState, useEffect } from "react";
import { ActionIcon, Button, Group, Menu, Tooltip, rem } from "@mantine/core";
import {
    IconPlus,
    IconChevronDown,
    IconGitBranch,
    IconFolderPlus,
    IconFileIsr,
    IconAdjustments,
    IconArticle,
    IconListTree,
    IconTable,
    IconSelector,
    IconLayoutGrid,
    IconFileReport,
    IconTag,
    IconShare,
    IconDotsVertical,
    IconTrash,
} from "@tabler/icons-react";
import useModalStore from "@/Modules/Common/Hooks/use-modal-store";
import { ItemParentResourceData } from "../Types/ItemParentResourceData";
import { Link } from "@inertiajs/react";
import CreateWorkflowForm from "@/Modules/Workflow/Forms/CreateWorkflowForm";
import { UpdateNumberingSchemeForm } from "@/Modules/NumberingScheme/Forms/UpdateNumberingSchemeForm";
import CreateNumberingSchemeForm from "@/Modules/NumberingScheme/Forms/CreateNumberingSchemeForm";
import CreateFolderForm from "@/Modules/Folder/Forms/FolderForm";
import UpdateWorkflowForm from "@/Modules/Workflow/Forms/UpdateWorkflowForm";
import useGenerateReport from "@/Modules/Common/Hooks/use-generate-report";
import ShareModalForm from "@/Modules/Folder/Forms/ShareModalForm";
import FolderPropertiesModal from "@/Modules/Folder/Forms/FolderPropertiesModal";
import DeleteFilesForm from "./DeleteFilesForm";
import { FolderResourceData } from "@/Modules/Folder/Types/FolderResourceData";

interface IProps {
    uploadFileRef?: React.RefObject<() => void>;
    itemParent?: ItemParentResourceData;
    folderUserRole?: "viewer" | "editor" | "admin";
}

const ItemToolbar: React.FC<IProps> = ({
    uploadFileRef,
    itemParent,
    folderUserRole,
}) => {
    const { openModal, modals } = useModalStore();
    const { generateReport } = useGenerateReport();
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener("resize", handleResize);
        handleResize(); // Initial check

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const renderActions = () => (
        <>
            <Tooltip label="Properties" position="bottom" withArrow>
                <ActionIcon
                    size="lg"
                    variant="transparent"
                    color="dark.3"
                    onClick={() => openModal("folderProperties")}
                >
                    <IconAdjustments size={18} />
                </ActionIcon>
            </Tooltip>

            <Tooltip label="Workflow" position="bottom" withArrow>
                <ActionIcon
                    variant="transparent"
                    size="lg"
                    color={itemParent?.workflow_id ? "green.8" : "dark.3"}
                    onClick={() =>
                        openModal(
                            itemParent?.workflow_id
                                ? "updateWorkflow"
                                : "createWorkflow"
                        )
                    }
                >
                    <IconGitBranch size={18} />
                </ActionIcon>
            </Tooltip>

            <Tooltip label="Share" position="bottom" withArrow>
                <ActionIcon
                    variant="transparent"
                    size="lg"
                    color={itemParent?.is_shared ? "green.8" : "dark.3"}
                    onClick={() => openModal("shareFolder")}
                >
                    <IconShare size={18} />
                </ActionIcon>
            </Tooltip>

            <Tooltip label="Metadata" position="bottom" withArrow>
                <ActionIcon
                    component={Link}
                    size="lg"
                    href={route("folder.showRequiredMetadata", {
                        id: itemParent?.item_id,
                    })}
                    variant="transparent"
                    color={
                        itemParent?.required_metadata?.length
                            ? "green.8"
                            : "dark.3"
                    }
                >
                    <IconTag size={18} />
                </ActionIcon>
            </Tooltip>

            <Tooltip label="Activity" position="bottom" withArrow>
                <ActionIcon
                    component={Link}
                    size="lg"
                    href={route("folder.activity-log", {
                        id: itemParent?.item_id,
                    })}
                    variant="transparent"
                    color="dark.3"
                >
                    <IconArticle size={18} />
                </ActionIcon>
            </Tooltip>

            <Tooltip label="Numbering" position="bottom" withArrow>
                <ActionIcon
                    size="lg"
                    variant="transparent"
                    color={
                        itemParent?.numbering_scheme_id ? "green.8" : "dark.3"
                    }
                    onClick={() =>
                        openModal(
                            itemParent?.numbering_scheme_id
                                ? "updateNumberingScheme"
                                : "createNumberingScheme"
                        )
                    }
                >
                    <IconListTree size={18} />
                </ActionIcon>
            </Tooltip>

            <Tooltip label="Column" position="bottom" withArrow>
                <ActionIcon
                    variant="transparent"
                    color="dark.3"
                    size="lg"
                    onClick={() => openModal("selectMetadataColumns")}
                >
                    <IconTable size={18} />
                </ActionIcon>
            </Tooltip>

            <Tooltip label="Report" position="bottom" withArrow>
                <ActionIcon
                    variant="transparent"
                    color="dark.3"
                    size="lg"
                    onClick={() => generateReport(itemParent?.item_id ?? "")}
                >
                    <IconFileReport size={18} />
                </ActionIcon>
            </Tooltip>

            <Tooltip label="Delete Folder" position="bottom" withArrow>
                <ActionIcon
                    variant="transparent"
                    size="lg"
                    color="red"
                    onClick={() => openModal("deleteFiles")}
                >
                    <IconTrash size={18} />
                </ActionIcon>
            </Tooltip>
        </>
    );

    return (
        <Group h="50%" px={32} align="center" justify="space-between">
            {(folderUserRole === "editor" || folderUserRole === "admin") && (
                <Group gap="xs">
                    <Menu
                        shadow="md"
                        width={220}
                        transitionProps={{
                            transition: "pop-top-left",
                        }}
                        position="bottom-start"
                    >
                        <Menu.Target>
                            <Button
                                variant="subtle"
                                color="dark.3"
                                leftSection={<IconPlus size={18} />}
                                rightSection={<IconChevronDown size={12} />}
                            >
                                New
                            </Button>
                        </Menu.Target>

                        <Menu.Dropdown>
                            <Menu.Item
                                leftSection={
                                    <IconFolderPlus
                                        style={{
                                            width: rem(14),
                                            height: rem(14),
                                        }}
                                    />
                                }
                                onClick={() => openModal("folder")}
                            >
                                New Folder
                            </Menu.Item>
                            <Menu.Item
                                leftSection={
                                    <IconFileIsr
                                        style={{
                                            width: rem(14),
                                            height: rem(14),
                                        }}
                                    />
                                }
                                onClick={() => uploadFileRef?.current?.()}
                            >
                                Upload Files
                            </Menu.Item>
                        </Menu.Dropdown>
                    </Menu>

                    {isMobile ? (
                        <Menu shadow="md" width={200}>
                            <Menu.Target>
                                <ActionIcon
                                    variant="transparent"
                                    color="dark.3"
                                    size="lg"
                                >
                                    <IconDotsVertical size={18} />
                                </ActionIcon>
                            </Menu.Target>
                            <Menu.Dropdown>{renderActions()}</Menu.Dropdown>
                        </Menu>
                    ) : (
                        renderActions()
                    )}
                </Group>
            )}

            {folderUserRole === "viewer" && (
                <Group gap="xs">
                    <Tooltip label="Activity" position="bottom" withArrow>
                        <ActionIcon
                            component={Link}
                            size="lg"
                            href={route("folder.activity-log", {
                                id: itemParent?.item_id,
                            })}
                            variant="transparent"
                            color="dark.3"
                        >
                            <IconArticle size={18} />
                        </ActionIcon>
                    </Tooltip>
                </Group>
            )}

            {/* Forms */}
            <CreateFolderForm itemParent={itemParent} />
            <CreateWorkflowForm itemParent={itemParent} />
            <UpdateWorkflowForm itemParent={itemParent} />
            <CreateNumberingSchemeForm itemParent={itemParent} />
            <UpdateNumberingSchemeForm itemParent={itemParent} />
            <ShareModalForm folderId={itemParent?.item_id ?? ""} />
            <FolderPropertiesModal itemParent={itemParent} />
            <DeleteFilesForm
                selectedIds={[itemParent?.item_id ?? ""]}
                setSelectedRecord={() => {}}
            />
        </Group>
    );
};

export default ItemToolbar;
