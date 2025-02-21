import { Head, Link } from "@inertiajs/react";
import { Card, Group, SimpleGrid, Stack, Text, ThemeIcon } from "@mantine/core";
import { Authenticated } from "@/Modules/Common/Layouts/AuthenticatedLayout/Authenticated";
import {
    IconActivity,
    IconArchive,
    IconReportAnalytics,
    IconTag,
    IconUsersGroup,
} from "@tabler/icons-react";
import BackupButton from "@/Modules/Item/Components/BackupButton";

const adminTools = [
    // {
    //     title: "Generate Report",
    //     description: "Create comprehensive reports",
    //     icon: <IconReportAnalytics />,
    //     href: "/generate-report",
    // },
    {
        title: "Manage Tags",
        description: "Tag and categorize documents efficiently",
        icon: <IconTag />,
        href: "/metadata",
    },
    // {
    //     title: "Customization",
    //     description: "Tailor the UI to your branding",
    //     icon: <IconReportAnalytics />,
    //     href: "/customization",
    // },
    // {
    //     title: "Numbering Scheme",
    //     description: "Implement systematic document numbering",
    //     icon: <IconReportAnalytics />,
    //     href: "/numbering-scheme",
    // },
    {
        title: "Manage Users",
        description: "Add, edit, and remove users",
        icon: <IconUsersGroup />,
        href: "/users",
    },
    {
        title: "Activity Log",
        description: "Track all document activities",
        icon: <IconActivity />,
        href: "/activity-log",
    },
    {
        title: "Archive",
        description: "View archived documents",
        icon: <IconArchive />,
        href: "/archive",
    },
];

export default function AdminToolsPage() {
    return (
        <Authenticated>
            <Head title="Admin Tools" />

            <Stack px={8} gap={24} py={8}>
                <div>
                    <Text component="h2" size="xl" fw={600} c="gray.8">
                        Admin Tools
                    </Text>
                    <Text c="dimmed">
                        Essential features for efficient document management
                    </Text>
                </div>

                <SimpleGrid spacing="lg" cols={{ base: 1, sm: 2 }} w="90%">
                    {adminTools.map((adminTool, index) => (
                        <Card
                            key={index}
                            shadow="xs"
                            radius="md"
                            withBorder
                            py={30}
                            px={28}
                            component={Link}
                            href={adminTool.href}
                        >
                            <Group gap={24}>
                                <ThemeIcon
                                    variant="light"
                                    size="xl"
                                    radius={40}
                                >
                                    {adminTool.icon}
                                </ThemeIcon>

                                <div>
                                    <Text size="md" fw="bold">
                                        {adminTool.title}
                                    </Text>
                                    <Text size="md" c="dimmed">
                                        {adminTool.description}
                                    </Text>
                                </div>
                            </Group>
                        </Card>
                    ))}
                    <BackupButton />
                </SimpleGrid>
            </Stack>
        </Authenticated>
    );
}
