import axios from "axios";
import { useState, useEffect } from "react";
import { NumberingSchemeResourceData } from "../Types/NumberingSchemeResourceData";

interface IProps {
    numberingSchemeId?: number;
    isOpen?: boolean;
}

export function useFetchNumberingScheme({ numberingSchemeId, isOpen }: IProps) {
    const [numberingScheme, setNumberingScheme] = useState<NumberingSchemeResourceData | null>(null);

    useEffect(() => {
        if (numberingSchemeId && isOpen) {
            fetchNumberingScheme(numberingSchemeId);
        }
    }, [numberingSchemeId, isOpen]);

    const fetchNumberingScheme = async (numberingSchemeId: number) => {
        try {
            const response = await axios.get(`/numbering-scheme/${numberingSchemeId}`);
            setNumberingScheme(response.data);
        } catch (error) {
            console.error("Error fetching numbering scheme", error);
        }
    };

    return numberingScheme;
}
