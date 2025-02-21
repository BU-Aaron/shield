import { httpGet } from "@/Modules/Item/Helpers/http-helper";

interface DownloadFilesProps {
    all?: boolean;
    ids?: string[];
    parentId?: string;
}

export function useDownloadFiles() {
    const downloadFiles = ({ all, ids, parentId }: DownloadFilesProps) => {
        if (!all && (!ids || ids.length === 0)) {
            alert("Please select items to download.");
            return;
        }

        const params = new URLSearchParams();
        if (parentId) {
            params.append("parent_id", String(parentId));
        }

        if (all) {
            params.append("all", "1");
        } else if (ids && ids.length > 0) {
            ids.forEach((id) => params.append("ids[]", id));
        }

        const url = `${route("item.download")}?${params.toString()}`;

        // Create a temporary link to trigger the download
        const link = document.createElement("a");
        link.href = url;
        link.style.display = "none";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return { downloadFiles };
}
