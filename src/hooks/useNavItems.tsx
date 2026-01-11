// src/hooks/useNavItems.tsx
import React from "react";
import HomeIcon from "@mui/icons-material/Home";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import ArticleIcon from "@mui/icons-material/Article";
import FavoriteIcon from "@mui/icons-material/Favorite";
import InfoIcon from "@mui/icons-material/Info";
import SearchIcon from "@mui/icons-material/Search";

import { useRecipesSummary } from "@/hooks";
import { RecipeFilter } from "@/types";
import { useIsUserLogged } from "@/stores/useAdminStore";

export type NavItem = {
    label: string;
    href?: string;
    icon: React.ReactNode;
    onClick?: () => void;
    hidden?: boolean;
};

export const useNavItems = (initialSummary?: RecipeFilter | null, onSearchClick?: () => void): NavItem[] => {
    const { summary: options } = useRecipesSummary(initialSummary || undefined);
    const isFiltersLoaded = options.title.length > 0;
    const isUserLogged = useIsUserLogged();
    return [
        { label: "Home", href: "/", icon: <HomeIcon /> },
        { label: "Przepisy", href: "/recipes", icon: <MenuBookIcon /> },
        { label: "Artykuły", href: "/blog", icon: <ArticleIcon /> },
        { label: "Ulubione", href: "/favorites", icon: <FavoriteIcon />, hidden: !isUserLogged },
        { label: "O mnie", href: "/about", icon: <InfoIcon /> },
        {
            label: "Szukaj",
            icon: <SearchIcon />,
            onClick: onSearchClick,
            hidden: !isFiltersLoaded,
        },
    ];
};
