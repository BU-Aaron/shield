import { Image } from "@mantine/core";
import React from "react";

interface OfficeLogoProps {
    h?: number;
    w?: number;
}

const OfficeLogo: React.FC<OfficeLogoProps> = ({ h = 50, w = 50 }) => {
    return <Image src="/images/iro-logo.png" h={h} w={w} />;
};

export default OfficeLogo;
