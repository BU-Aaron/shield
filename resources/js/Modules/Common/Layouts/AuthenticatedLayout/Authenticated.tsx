import Sidebar from "@/Modules/Common/Components/Sidebar/Sidebar";
import { Link, usePage } from "@inertiajs/react";
import {
    ActionIcon,
    AppShell,
    Avatar,
    Box,
    Burger,
    Button,
    Center,
    Divider,
    Drawer,
    Flex,
    Group,
    Indicator,
    Menu,
    rem,
    Stack,
    Text,
    TextInput,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
    IconBell,
    IconInbox,
    IconLayoutGrid,
    IconLogout,
    IconSearch,
    IconUser,
} from "@tabler/icons-react";
import { PageProps } from "../../Types";
import GlobalSearch from "@/Modules/GlobalSearch/Components/GlobalSearch";
import NotificationMenu from "@/Modules/Notification/Components/NotificationMenu";

interface IProps {
    children: React.ReactNode;
    toolbar?: React.ReactNode;
}

export function Authenticated({ children, toolbar }: IProps) {
    const [opened, { toggle }] = useDisclosure();

    const { props } = usePage<PageProps>();
    const user = props.auth.user;
    const systemRole = props.auth.systemRole;

    return (
        <AppShell
            layout="alt"
            header={{ height: toolbar ? 120 : 60 }}
            navbar={{
                width: 250,
                breakpoint: "md",
                collapsed: { mobile: !opened },
            }}
            padding="md"
        >
            <AppShell.Header>
                <Flex h={toolbar ? "50%" : "100%"} px={32} justify="space-between" align="center">
                    <Burger opened={opened} onClick={toggle} hiddenFrom="md" size="sm" />

                    <GlobalSearch />

                    <Group align="center" gap={8}>
                        {systemRole === 'admin' && (
                            <Button
                                component={Link}
                                href={route('admin.tools')}
                                leftSection={<IconLayoutGrid stroke={1.5} />}
                                radius="md"
                                variant="light"
                            >
                                Admin Tools
                            </Button>
                        )}
                        <NotificationMenu notifications={props.notifications} />
                        <Menu
                            width={200}
                            transitionProps={{
                                transition: "pop-top-right",
                            }}
                            position="bottom-end"
                        >
                            <Menu.Target>
                                <ActionIcon variant="subtle" color="gray" size="xl" radius="xl">
                                    <Avatar name={user.name} color="blue" size="md" />
                                </ActionIcon>
                            </Menu.Target>
                            <Menu.Dropdown>
                                <Menu.Item
                                    component={Link}
                                    leftSection={
                                        <IconUser
                                            style={{
                                                width: rem(14),
                                                height: rem(14),
                                            }}
                                        />
                                    }
                                    href={route("profile.edit")}
                                >
                                    Profile
                                </Menu.Item>
                                <Menu.Item
                                    component={Link}
                                    leftSection={
                                        <IconLogout
                                            style={{
                                                width: rem(14),
                                                height: rem(14),
                                            }}
                                        />
                                    }
                                    href={route("logout")}
                                    as="button"
                                    method="post"
                                >
                                    Logout
                                </Menu.Item>
                            </Menu.Dropdown>
                        </Menu>
                    </Group>
                </Flex>

                <Divider />

                {toolbar}
            </AppShell.Header>

            {!opened && (
                <AppShell.Navbar>
                    <Sidebar />
                </AppShell.Navbar>
            )}

            <Drawer opened={opened} onClose={toggle} size="sm">
                <Sidebar />
            </Drawer>

            <AppShell.Main>
                <Box px={14}>{children}</Box>
            </AppShell.Main>
        </AppShell>
    );
}
