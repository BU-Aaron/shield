import { Button, CheckIcon, ColorSwatch, Group, rem, Stack, Text } from "@mantine/core";
import { useState } from "react";

const Themes = () => {
    const [selectedColor, setSelectedColor] = useState("red");

    const colors = ["red", "blue", "orange", "dark", "violet", "green"];

    return (
        <Group gap={240}>
            <Stack gap={20} w={200}>
                <div>
                    <Text fw={600}>Themes</Text>
                    <Text c="dimmed">Customize your system’s appearance</Text>
                </div>
                <Button>Save Changes</Button>
            </Stack>

            <Group gap={8}>
                {colors.map((color) => (
                    <ColorSwatch
                        key={color}
                        component="button"
                        color={`var(--mantine-color-${color}-6)`}
                        onClick={() => setSelectedColor(color)}
                        style={{ color: "#fff", cursor: "pointer", margin: rem(8) }}
                        size={32}
                    >
                        {selectedColor === color && (
                            <CheckIcon style={{ width: rem(14), height: rem(14) }} />
                        )}
                    </ColorSwatch>
                ))}
            </Group>
        </Group>
    );
};

export default Themes;
