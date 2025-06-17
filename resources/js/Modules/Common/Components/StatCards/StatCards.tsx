import { Group, Paper, SimpleGrid, Text, Grid, Badge } from "@mantine/core";
import { IconFile, IconCheck, IconX, IconClock, IconMessage, IconMessageCheck, IconMessageX, IconFileX, IconFileCheck, IconFileDescription, IconSearch, IconFingerprint, IconAlertTriangle, IconGavel, IconBadge, IconReport } from "@tabler/icons-react";
import { DashboardResource } from "@/Modules/Dashboard/Types/DashboardResource";
import classes from "./StatCards.module.css";
import { router } from "@inertiajs/react";

interface StatCardsProps {
    dashboard: DashboardResource;
}

const icons = {
    review_pending: IconSearch,
    review_accepted: IconFingerprint,
    review_rejected: IconAlertTriangle,
    approval_pending: IconGavel,
    approval_accepted: IconBadge,
    approval_rejected: IconReport,
    total_documents: IconFileDescription,
};

export function StatCards({ dashboard }: StatCardsProps) {
    const data = [
        {
            title: "INV",
            icon: "review_accepted",
            value: dashboard.number_of_inv,
            color: "teal",
            statusParam: "reviewal_accepted",
        },
        {
            title: "INQ",
            icon: "review_pending",
            value: dashboard.number_of_inq,
            color: "orange",
            statusParam: "reviewal_pending",
        },
        {
            title: "UI",
            icon: "review_rejected",
            value: dashboard.number_of_ui,
            color: "red",
            statusParam: "reviewal_rejected",
        },
        {
            title: "Total Documents",
            icon: "total_documents",
            value: dashboard.number_of_documents,
            color: "violet",
            statusParam: null,
        },
    ] as const;

    const totalDocuments = data.find((stat) => stat.title === "Total Documents");
    const otherStats = data.filter((stat) => stat.title !== "Total Documents");

    const renderCard = (stat: typeof data[number], doubleHeight: boolean = false) => {
        const Icon = icons[stat.icon];

        /*const handleClick = () => {
            if (stat.statusParam) {
                router.visit(`/dashboard/reports?document_status=${stat.statusParam}`);
            }
        };
        */

        return (
            <Paper
                withBorder
                p="lg"
                radius="md"
                key={stat.title}
                // onClick={handleClick}
                shadow="xs"
                style={{
                    cursor: stat.statusParam ? "pointer" : "default",
                }}
                className={`${classes.card} ${doubleHeight ? classes.doubleHeight : ""}`}
            >
                <Group justify="left" mb="sm">
                    <div
                        style={{
                            backgroundColor: `var(--mantine-color-${stat.color}-light)`,
                            borderRadius: "50%",
                            padding: "10px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <Icon
                            className={classes.icon}
                            size="1.4rem"
                            color={`var(--mantine-color-${stat.color}-light-color)`}
                            height={32}
                            width={32}
                        />
                    </div>
                </Group>

                <Text size="sm" c="dimmed" className={classes.title}>
                    {stat.title}
                </Text>

                <Group align="center" mt={10}>
                    <Text className={classes.value} size="lg">
                        {stat.value}
                    </Text>
                </Group>
            </Paper>
        );
    };

    return (
        <div className={classes.root}>
            <Grid>
                <Grid.Col>
                    <SimpleGrid
                        cols={{ base: 1, lg: 3 }}
                    >
                        {otherStats.map((stat) => renderCard(stat))}
                    </SimpleGrid>
                </Grid.Col>
            </Grid>
        </div >
    );
}
