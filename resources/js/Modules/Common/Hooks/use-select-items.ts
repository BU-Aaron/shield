// @ts-nocheck
import { useState } from "react";
import { FileData } from "@/Modules/Common/Types/types";

export function useSelectItems() {
    const [selectedRecord, setSelectedRecord] = useState<FileData[]>([]);

    const extractIds = (records: FileData[]): string[] => {
        return records.map((record) => record.id);
    };

    const ids = extractIds(selectedRecord);

    return { selectedRecord, setSelectedRecord, ids };
}