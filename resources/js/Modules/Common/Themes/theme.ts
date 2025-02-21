import { createTheme, Input, Modal } from "@mantine/core";

export const theme = createTheme({
    /** Put your mantine theme override here */
    fontFamily: "Inter, sans-serif",
    primaryColor: "blue",
    colors: {
        blue: [
            "#E3FFC",
            "#C6DDF7",
            "#B6D8FF",
            "#80BFFF",
            "#3D89DF",
            "#1671D9",
            "#0D5EBA",
            "#034592",
            "#04326B",
            "#012657",
            "#001633",
        ],
    },
    components: {
        Modal: Modal.extend({
            defaultProps: {
                radius: 12,
                padding: "md",
            },
        }),
    },
});
