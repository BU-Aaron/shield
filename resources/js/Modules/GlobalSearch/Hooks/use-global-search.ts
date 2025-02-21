import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import { SearchResults } from '../Types/SearchResultTypes';

export function useGlobalSearch(initialQuery: string = '') {
    const [query, setQuery] = useState(initialQuery);
    const [results, setResults] = useState<SearchResults | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (query.trim() === '') {
            setResults(null);
            return;
        }

        setLoading(true);

        router.get('/search', { query }, {
            onSuccess: (page) => {
                setLoading(false);
            },
            onError: () => {
                setLoading(false);
            },
        });
    }, [query]);

    return { query, setQuery, results, loading };
}