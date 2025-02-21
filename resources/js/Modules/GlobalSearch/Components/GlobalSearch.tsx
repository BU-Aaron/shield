import React, { useState } from 'react';
import { TextInput } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import { router } from '@inertiajs/react';

const GlobalSearch: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim() !== '') {
            router.get('/search', { query: searchQuery });
        }
    };

    return (
        <form onSubmit={handleSearch}>
            <TextInput
                leftSection={<IconSearch size={16} />}
                placeholder="Search for documents"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                w={{ base: 300, lg: 550 }}
                visibleFrom="sm"
                variant="filled"
            />
        </form>
    );
};

export default GlobalSearch;