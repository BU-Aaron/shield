import { useEffect, useState } from "react";
import axios from "axios";
import { MetadataResourceData } from "@/Modules/Metadata/Types/MetadataResourceData";

interface UseFetchExistingMetadataColumnProps {
    folderId: string;
    isOpen: boolean;
}

export function useFetchExistingMetadataColumn({ folderId, isOpen }: UseFetchExistingMetadataColumnProps) {
    const [existingMetadataColumns, setExistingMetadataColumns] = useState<MetadataResourceData[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchExistingMetadata = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`/folder/${folderId}/metadata_columns`);
                setExistingMetadataColumns(response.data.metadata_columns);
                setError(null);
            } catch (err) {
                setError("Failed to fetch existing metadata columns.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (folderId && isOpen) {
            fetchExistingMetadata();
        }
    }, [folderId, isOpen]);

    return { existingMetadataColumns, loading, error };
}