import React from "react";
import ApproveIcon from "@/Modules/Common/Components/ApproveIcon/ApproveIcon";
import {
    ActionIcon,
    Avatar,
    Badge,
    Burger,
    Button,
    Card,
    Divider,
    Flex,
    Group,
    Menu,
    Paper,
    rem,
    Stack,
    Text,
    Textarea,
} from "@mantine/core";
import { Head, Link, router, useForm, usePage } from "@inertiajs/react";
import {
    IconDownload,
    IconEye,
    IconFileTypePdf,
    IconFolder,
    IconLayoutGrid,
    IconLogout,
    IconMessageCircle,
    IconUser,
} from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { DocumentApprovalResourceData } from "@/Modules/DocumentApproval/Types/DocumentApprovalResourceData";
import StateBadge from "@/Modules/Common/Components/StateBadge/StateBadge";
import { PageProps } from "@/Modules/Common/Types";
import { useDisclosure } from "@mantine/hooks";
import NotificationMenu from "@/Modules/Notification/Components/NotificationMenu";
import OfficeLogo from "@/Modules/Common/Components/OfficeLogo/OfficeLogo";
import { DocumentApprovalHasUserData } from "@/Modules/DocumentApproval/Types/DocumentApprovalHasUserData";
import { useDownloadFiles } from "@/Modules/Common/Hooks/use-download-files";

interface IProps {
    documentApproval: DocumentApprovalResourceData;
}

const ApproveDocumentPage: React.FC<IProps> = ({ documentApproval }) => {
    const { props } = usePage<PageProps>();
    const user = props.auth.user;
    const isAdmin = props.auth.systemRole === "admin";
    const [opened, { toggle }] = useDisclosure();

    const { data, setData, post, processing } =
        useForm<DocumentApprovalHasUserData>({
            comment: "",
        });

    const { downloadFiles } = useDownloadFiles();

    const handleDocumentAction = (action: "accept" | "reject") => {
        post(
            route(`document_user_approval.${action}`, {
                userApproval: documentApproval.current_user_approval_id,
            }),
            {
                onSuccess: () => {
                    notifications.show({
                        position: "top-center",
                        message: `Document ${action}ed successfully`,
                        color: action === "accept" ? "green" : "red",
                    });
                },
                onError: (errors) => {
                    notifications.show({
                        position: "top-center",
                        message: "Something went wrong",
                        color: "red",
                    });
                },
            }
        );
    };

    return (
        <>
            <Head title="Approve Document" />
            <Flex h={72} px={32} justify="space-between" align="center">
                <Burger
                    opened={opened}
                    onClick={toggle}
                    hiddenFrom="sm"
                    size="sm"
                />
                <Link href="/dashboard">
                    <OfficeLogo h={48} w={48} />
                </Link>

                <Group align="center" gap={8}>
                    {isAdmin && (
                        <Button
                            component={Link}
                            href={route("admin.tools")}
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
                            <ActionIcon
                                variant="subtle"
                                color="gray"
                                size="xl"
                                radius="xl"
                            >
                                <Avatar
                                    name={user.name}
                                    color="blue"
                                    size="md"
                                />
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

            <Flex
                mih={100}
                justify="center"
                mb={48}
                style={{ padding: "1rem" }}
            >
                <div style={{ maxWidth: "600px", width: "100%" }}>
                    <Stack gap={16} align="center" mb={16}>
                        <ApproveIcon />
                        <Text fw={500} size="xl" ta="center">
                            This document needs your {documentApproval.type}{" "}
                            decision
                        </Text>
                        <Text size="sm" c="gray.8">
                            Resolution:{" "}
                            {documentApproval.resolution
                                ? documentApproval.resolution
                                : "None"}
                        </Text>
                    </Stack>

                    <Stack gap={24}>
                        {documentApproval.destination && (
                            <Group>
                                <IconFolder color="none" fill="gray" />
                                <Text fw={500} size="lg" c="gray">
                                    {documentApproval.destination ||
                                        "No Destination"}
                                </Text>
                            </Group>
                        )}

                        <Card
                            shadow="xs"
                            radius="sm"
                            withBorder
                            py={24}
                            px={20}
                        >
                            <Group gap={24} justify="space-between">
                                <Group>
                                    <IconFileTypePdf />
                                    <div>
                                        <Text size="md" fw="bold">
                                            {documentApproval.document_name}
                                        </Text>
                                        <Text size="md" c="dimmed">
                                            {documentApproval.created_at} -{" "}
                                            <StateBadge
                                                state={
                                                    documentApproval.overall_state
                                                }
                                            />
                                        </Text>
                                    </div>
                                </Group>
                                <ActionIcon
                                    // onClick={() => downloadFiles({ all: false, ids: [documentApproval.document_id] })}
                                    component="a"
                                    href={route("document.view", {
                                        document: documentApproval.document_id,
                                    })}
                                    target="_blank"
                                    variant="subtle"
                                >
                                    <IconEye />
                                </ActionIcon>
                            </Group>
                        </Card>

                        <Text fw={500} size="md">
                            Users in this approval process
                        </Text>

                        {documentApproval.document_user_approvals.map(
                            (userApproval) => (
                                <Paper
                                    key={userApproval.user_id}
                                    withBorder
                                    radius="sm"
                                    p={16}
                                >
                                    <Group>
                                        <Avatar />
                                        <Stack gap={10}>
                                            <Text size="md" fw={500}>
                                                {userApproval.user_name}
                                            </Text>
                                            <StateBadge
                                                state={userApproval.user_state}
                                            />
                                            {userApproval.comment && (
                                                <Text size="sm" c="dimmed">
                                                    <IconMessageCircle
                                                        size={14}
                                                    />{" "}
                                                    {userApproval.comment}
                                                </Text>
                                            )}
                                            {userApproval.user_state !==
                                                "Pending" && (
                                                <Text size="sm" c="dimmed">
                                                    Decision made on:{" "}
                                                    {new Date(
                                                        userApproval.updated_at
                                                    ).toLocaleDateString()}
                                                </Text>
                                            )}
                                        </Stack>
                                    </Group>
                                </Paper>
                            )
                        )}

                        {!documentApproval.is_done && (
                            <Stack>
                                <Textarea
                                    label="Comment"
                                    placeholder="Add your comment on this document"
                                    autosize
                                    minRows={4}
                                    maxRows={6}
                                    style={{ width: "100%" }}
                                    value={data.comment}
                                    onChange={(e) =>
                                        setData("comment", e.target.value)
                                    }
                                />

                                <Flex align="center" justify="end">
                                    <Button
                                        color="red"
                                        onClick={() =>
                                            handleDocumentAction("reject")
                                        }
                                        disabled={
                                            processing ||
                                            documentApproval.is_done
                                        }
                                    >
                                        Reject
                                    </Button>

                                    <Button
                                        ml={12}
                                        color="green"
                                        onClick={() =>
                                            handleDocumentAction("accept")
                                        }
                                        disabled={
                                            processing ||
                                            documentApproval.is_done
                                        }
                                    >
                                        Approve
                                    </Button>
                                </Flex>
                            </Stack>
                        )}

                        {documentApproval.is_done && (
                            <Stack align="center" gap={16}>
                                <Text c="green" size="md" ta="center">
                                    You have already made a decision on this
                                    document.
                                </Text>
                                <Button
                                    component={Link}
                                    href="/dashboard" // Change this route as needed
                                    variant="subtle"
                                    color="blue"
                                >
                                    Back to Home
                                </Button>
                            </Stack>
                        )}
                    </Stack>
                </div>
            </Flex>
        </>
    );
};

export default ApproveDocumentPage;
