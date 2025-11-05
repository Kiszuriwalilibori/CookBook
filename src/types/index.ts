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
    dietaryRestrictions: string[];
    products: string[];
}
