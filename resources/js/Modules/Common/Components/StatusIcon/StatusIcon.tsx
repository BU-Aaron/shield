import React from "react";
import { IconSquareCheckFilled, IconMessageFilled } from "@tabler/icons-react";
import { getColorStatus } from "@/Modules/Common/Helpers/get-color-status";

interface StatusIconProps {
    state?: string;
}

export const StatusIcon: React.FC<StatusIconProps> = ({ state }) => {
    const indicatorColor = getColorStatus(state);

    if (state?.includes("Approval")) {
        return <IconSquareCheckFilled color={indicatorColor} />;
    } else if (state?.includes("Reviewal")) {
        return <IconMessageFilled color={indicatorColor} />;
    }
    return null;
};
