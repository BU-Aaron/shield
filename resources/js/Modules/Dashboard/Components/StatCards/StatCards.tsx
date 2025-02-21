import { Group, Paper, SimpleGrid, Text } from "@mantine/core";
import { IconFile } from "@tabler/icons-react";
import classes from "./StatCards.module.css";

const icons = {
    user: IconFile,
    discount: IconFile,
    receipt: IconFile,
    coin: IconFile,
};

const data = [
    { title: "Total Documents", icon: "receipt", value: "214", diff: 34, color: "blue" },
    { title: "Approved", icon: "coin", value: "124", diff: -13, color: "green" },
    { title: "Rejected", icon: "discount", value: "67", diff: 18, color: "red" },
    { title: "Needing Approval", icon: "user", value: "23", diff: -30, color: "orange" },
] as const;

export function StatCards() {
    const stats = data.map((stat) => {
        const Icon = icons[stat.icon];

        return (
            <Paper withBorder p="md" radius="md" key={stat.title}>
                <Group justify="space-between">
                    <Text size="sm" c="dimmed" className={classes.title}>
                        {stat.title}
                    </Text>
                    <Icon
                        className={classes.icon}
                        size="1.4rem"
                        stroke={1.5}
                        color={stat.color}
                        height={32}
                        width={32}
                    />
                </Group>

                <Group align="flex-end" gap="xs" mt={25}>
                    <Text className={classes.value}>{stat.value}</Text>
                </Group>
            </Paper>
        );
    });
    return (
        <div className={classes.root}>
            <SimpleGrid cols={{ base: 1, xs: 2, md: 4 }}>{stats}</SimpleGrid>
        </div>
    );
}