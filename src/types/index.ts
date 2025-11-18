import { ReactNode } from "react";

export interface MenuItem {
    label: string;
    href: string;
    icon?: ReactNode; // For MUI icons
}

export interface Options {
    titles: string[];
    cuisines: string[];
    tags: string[];
    dietary: string[];
    products: string[];
}
export type { FilterState } from "@/hooks/useFilters";
