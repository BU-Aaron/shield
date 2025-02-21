import { useState } from "react";
import { router } from "@inertiajs/react";

export function useSearchDataTable(initialSearch: string = "", url: string) {
    const [search, setSearch] = useState(initialSearch);

    const handleSearch = (search: string) => {
        setSearch(search);
        router.get(url, { search }, { preserveState: true, replace: true });
    };

    return { search, setSearch, handleSearch };
}