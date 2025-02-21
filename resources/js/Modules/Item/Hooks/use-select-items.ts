import { useState } from "react";
import { ItemContentsResourceData } from "@/Modules/Item/Types/ItemContentsResourceData";   

export function useSelectItems() {
    const [selectedRecord, setSelectedRecord] = useState<ItemContentsResourceData[]>([]);

    const extractIds = (records: ItemContentsResourceData[]): string[] => {
        return records.map((record) => record.id);
    };

    const ids = extractIds(selectedRecord);

    return { selectedRecord, setSelectedRecord, ids };
}