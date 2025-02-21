import { ActivityLogResourceData } from "./ActivityLogResourceData";

export type PaginationLinks = {
    url: string | null;
    label: string;
    active: boolean;
};

export type PaginationData = {
    current_page: number;
    data: ActivityLogResourceData[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: PaginationLinks[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
};

export type Filters = {
    search: string;
};