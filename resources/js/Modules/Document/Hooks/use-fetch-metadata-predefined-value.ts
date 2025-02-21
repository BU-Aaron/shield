// resources/js/Modules/Metadata/Hooks/use-fetch-metadata-predefined-value.ts
import { useEffect, useState } from "react";
import axios from "axios";

interface PredefinedValue {
    id: number;
    predefined_value: string;
}

export default function useFetchMetadataPredefinedValue(
    metadataId: number | null
) {
    const [predefinedValues, setPredefinedValues] = useState<PredefinedValue[]>(
        []
    );
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPredefinedValues = async () => {
            if (metadataId === null) {
                setPredefinedValues([]);
                return;
            }

            setLoading(true);
            try {
                const response = await axios.get(
                    route("metadata.predefined-values", {
                        metadata: metadataId,
                    })
                );
                setPredefinedValues(response.data.predefined_values);
                setError(null);
            } catch (err) {
                setError("Failed to fetch predefined values.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchPredefinedValues();
    }, [metadataId]);

    return { predefinedValues, loading, error };
}
