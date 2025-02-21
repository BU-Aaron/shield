import axios from "axios";

interface GenerateDashboardReportPayload {
    document_status?: string | null;
    start_date?: string | null;
    end_date?: string | null;
    metadata_ids?: number[];
}

export default function useGenerateDashboardReport() {
    const generateReport = async (folderItemId: string) => {
        try {
            const response = await axios.post(route("report.generate"), {
                folder_item_id: folderItemId,
            });

            const { url, filename } = response.data;

            if (url) {
                // Create a temporary link to trigger the download
                const link = document.createElement("a");
                link.href = url;
                link.download = filename;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } else {
                console.error("No URL returned for the report.");
            }
        } catch (error: any) {
            console.error(
                "Error generating report:",
                error.response?.data || error.message
            );
        }
    };

    const generateDashboardReport = async (
        payload: GenerateDashboardReportPayload
    ) => {
        try {
            const response = await axios.post(
                route("report.generateDashboard"),
                payload
            );

            const { url, filename } = response.data;

            if (url) {
                // Create a temporary link to trigger the download
                const link = document.createElement("a");
                link.href = url;
                link.download = filename;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } else {
                console.error("No URL returned for the dashboard report.");
            }
        } catch (error: any) {
            console.error(
                "Error generating dashboard report:",
                error.response?.data || error.message
            );
        }
    };

    return { generateReport, generateDashboardReport };
}
