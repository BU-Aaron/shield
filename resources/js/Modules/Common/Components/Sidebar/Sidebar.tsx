import { Link, usePage } from "@inertiajs/react";
import {
    Group,
    Box,
    Text,
    Divider,
    ActionIcon,
    Menu,
    rem,
    Tooltip,
} from "@mantine/core";
import {
    IconTrash,
    IconLayoutDashboard,
    IconPlus,
    IconDotsVertical,
    IconUsers,
    IconShare,
} from "@tabler/icons-react";
import classes from "./Sidebar.module.css";
import OfficeLogo from "../OfficeLogo/OfficeLogo";
import { WorkspaceLinksData } from "@/Modules/Workspace/Types/WorkspaceLinksData";
import WorkspaceForm from "@/Modules/Workspace/Forms/WorkspaceForm";
import useModalStore from "../../Hooks/use-modal-store";
import ArqFolder from "../IconFiles/ArqFolder";

const NAV_LINKS = [
    {
        label: "Dashboard",
        icon: IconLayoutDashboard,
        href: "/dashboard",
        adminOnly: true,
    },
    {
        label: "Shared with me",
        icon: IconShare,
        href: "/item/shared-with-me",
        adminOnly: false,
    },
    {
        label: "Trash",
        icon: IconTrash,
        href: "/trash",
        adminOnly: true,
    },
];

const Sidebar: React.FC = () => {
    const { workspaces, auth, currentWorkspace } = usePage<{
        workspaces: WorkspaceLinksData[];
        auth: { systemRole: string };
        currentWorkspace: string;
    }>().props;
    const { openModal } = useModalStore();

    // const currentPath = window.location.pathname;

    const renderNavLinks = NAV_LINKS.filter((link) => {
        // Show link if it's not adminOnly or the user is admin
        // const isAllowed = auth.systemRole === "admin";
        // Additionally, hide "Shared with me" if the user is admin
        const isSharedWithMe = link.label === "Shared with me";
        const shouldHideSharedWithMe =
            isSharedWithMe && auth.systemRole === "admin";
        return !shouldHideSharedWithMe;
        return true;
    }).map(({ label, icon: Icon, href }) => (
        <Link
            className={classes.link}
            data-active={currentWorkspace === href || undefined}
            href={href}
            key={label}
        >
            <Icon className={classes.linkIcon} stroke={1.5} />
            <span>{label}</span>
        </Link>
    ));

    const renderWorkspaceLinks = workspaces.map((workspace) => (
        <Link
            className={classes.workspaceLinkWrapper}
            key={workspace.item_id}
            data-active={currentWorkspace === workspace.url || undefined}
            href={workspace.url}
        >
            {/* <Link className={classes.workspaceLinkDesign} href={workspace.url}> */}
            <div className={classes.workspaceLinkContent}>
                <ArqFolder className={classes.linkIcon} />
                <span>{workspace.name}</span>
            </div>
            {/* </Link> */}
        </Link>
    ));

    return (
        <>
            <nav className={classes.navbar}>
                <div className={classes.navbarMain}>
                    <Group className={classes.header}>
                        <Link href="/">
                            <OfficeLogo h={48} w={48} />
                        </Link>
                    </Group>
                    <Box mb={12}>{renderNavLinks}</Box>
                    <Divider />
                    <Group justify="space-between" p="sm" mt={12}>
                        <Text size="xs" fw={500} c="dimmed">
                            Sections
                        </Text>

                        {auth.systemRole === "admin" && (
                            <Tooltip
                                label="New section"
                                withArrow
                                position="right"
                            >
                                <ActionIcon
                                    variant="default"
                                    size={18}
                                    onClick={() => openModal("workspace")}
                                >
                                    <IconPlus
                                        style={{
                                            width: rem(12),
                                            height: rem(12),
                                        }}
                                        stroke={1.5}
                                    />
                                </ActionIcon>
                            </Tooltip>
                        )}
                    </Group>
                    <div className={classes.workspaces}>
                        {renderWorkspaceLinks}
                    </div>
                </div>
            </nav>

            <WorkspaceForm />
        </>
    );
};

export default Sidebar;
