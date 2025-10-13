import { ReactNode } from "react";

export interface MenuItem {
    label: string;
    href: string;
    icon?: ReactNode; // For MUI icons
}
