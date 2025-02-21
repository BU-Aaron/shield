import {
    IconFolder,
    IconPhoto,
    IconFileTypePdf,
    IconFileMusic,
    IconVideo,
    IconFileWord,
    IconFileSpreadsheet,
    IconFileZip,
    IconFileText,
    IconFile,
    IconSquareCheckFilled,
    IconMessageFilled,
    IconTag,
} from "@tabler/icons-react";
import {
    isAudio,
    isExcel,
    isImage,
    isPDF,
    isText,
    isVideo,
    isWord,
    isZip,
} from "@/Modules/Item/Helpers/file-helper";
import { Group } from "@mantine/core";
import ArqPdf from "../IconFiles/ArqPdf";
import ArqDefault from "../IconFiles/ArqDefault";
import ArqFolder from "../IconFiles/ArqFolder";
import { StatusIcon } from "../StatusIcon/StatusIcon";
import ArqImage from "../IconFiles/ArqImage";
import ArqDoc from "../IconFiles/ArqDoc";

interface ItemIconProps {
    mime: string;
    isFolder: boolean;
    reviewStatus?: string | undefined;
    approvalStatus?: string | undefined;
    missingRequiredMetadata?: boolean;
}

export const ItemIcon: React.FC<ItemIconProps> = ({ mime, isFolder, reviewStatus, approvalStatus, missingRequiredMetadata }) => {
    const renderIcon = () => {
        if (isFolder) {
            return <ArqFolder size={32} />;
        } else if (isImage(mime)) {
            return <ArqImage size={32} />;
        } else if (isPDF(mime)) {
            return <ArqPdf size={32} />;
        } else if (isAudio(mime)) {
            return <IconFileMusic size={20} />;
        } else if (isVideo(mime)) {
            return <IconVideo size={20} />;
        } else if (isWord(mime)) {
            return <ArqDoc size={32} />;
        }
        return <ArqDefault size={36} />;
    };

    return (
        <Group gap={4}>
            {renderIcon()}
            {missingRequiredMetadata && <IconTag color="red" />}
            <StatusIcon state={reviewStatus} />
            <StatusIcon state={approvalStatus} />
        </Group>
    );
};
