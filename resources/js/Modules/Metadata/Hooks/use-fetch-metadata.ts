import { useEffect, useState } from "react";
import axios from "axios";
import { FolderRequiredMetadataResource } from "@/Modules/Folder/Types/FolderRequiredMetadataResource";

export default function useFetchMetadata() {
    const [metadataList, setMetadataList] = useState<FolderRequiredMetadataResource[]>([]);

    useEffect(() => {
        axios.get(route('metadata.fetch'))
            .then((response: { data: { metadata: FolderRequiredMetadataResource[] } }) => {
                setMetadataList(response.data.metadata);
            })
            .catch(error => {
                console.error("Error fetching metadata:", error);
            });
    }, []);

    return { metadataList };
}