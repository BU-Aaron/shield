import { useState, useEffect } from "react";
import axios from "axios";
import { ItemParentResourceData } from "@/Modules/Item/Types/ItemParentResourceData";
import { ItemAncestorsResourceData } from "@/Modules/Item/Types/ItemAncestorsResourceData";
import { MoveItemContentsResource } from "../Types/MoveItemContentsResource";

interface ShowItemsData {
    itemParent: ItemParentResourceData | null;
    itemAncestors: ItemAncestorsResourceData | null;
    itemContents: MoveItemContentsResource[];
}

export default function useShowItems(itemId: string | null, isOpen: boolean) {
    const [data, setData] = useState<ShowItemsData>({
        itemParent: null,
        itemAncestors: null,
        itemContents: [],
    });
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            fetchItems(itemId);
        }
    }, [itemId, isOpen]);

    const fetchItems = async (itemId: string | null) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(route("item.showItems", { item: itemId }));
            setData(response.data);
        } catch (err) {
            setError("Failed to fetch items.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return { data, loading, error };
}