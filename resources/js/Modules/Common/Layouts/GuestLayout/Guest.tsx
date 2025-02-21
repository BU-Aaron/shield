import { PropsWithChildren } from "react";
import { Link } from "@inertiajs/react";
import { Flex, Paper, Text } from "@mantine/core";
import classes from "./GuestLayout.module.css";
import OfficeLogo from "@/Modules/Common/Components/OfficeLogo/OfficeLogo";

export default function Guest({ children }: PropsWithChildren) {
    return (
        <Flex
            direction="column"
            align="center"
            mih={{ md: "100vh", base: "auto" }}
            justify="center"
            pt={{ base: 40, md: 24 }}
            style={{
                backgroundColor:
                    "light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-6))",
                padding: '0 16px', // Add padding for mobile
            }}
        >
            <div>
                <Link href="/">
                    <OfficeLogo h={72} w={72} /> {/* Adjust logo size for mobile */}
                </Link>
            </div>

            <Paper shadow="md" withBorder radius="lg" className={classes.card}>
                {children}

                {/* Powered by Arquivo Footer */}
                <Text size="sm" ta="center" mt="md" c="dimmed">
                    Powered by Arquivo
                </Text>
            </Paper>
        </Flex>
    );
}
