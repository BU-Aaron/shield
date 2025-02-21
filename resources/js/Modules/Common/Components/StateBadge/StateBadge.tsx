import { Badge } from "@mantine/core";
import { getColorStatus } from "@/Modules/Common/Helpers/get-color-status";

interface StateBadgeProps {
    state: string | undefined;
}

const StateBadge: React.FC<StateBadgeProps> = ({ state }) => {
    return <Badge color={getColorStatus(state)} variant="light">{state ?? "None"}</Badge>;
};

export default StateBadge;
