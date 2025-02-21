import { useState } from "react";

export function useFilterActivityLog() {
    const [search, setSearch] = useState("");

    return {
        search,
        setSearch,
    };
}
