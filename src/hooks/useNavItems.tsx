// src/hooks/useNavItems.tsx
import React, { useEffect } from "react";
import HomeIcon from "@mui/icons-material/Home";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import ArticleIcon from "@mui/icons-material/Article";
import FavoriteIcon from "@mui/icons-material/Favorite";
import InfoIcon from "@mui/icons-material/Info";
import SearchIcon from "@mui/icons-material/Search";

import { useFavoritesStore } from "@/stores/useFavoritesStore";
import { useLastRecipesStore } from "@/stores/useLastRecipesStore";

export type NavItem = {
    label: string;
    href?: string;
    icon: React.ReactNode;
    onClick?: () => void;
    hidden?: boolean;
};

export const useNavItems = (): NavItem[] => {
    const { areFavoritesEmpty } = useFavoritesStore();
    const lastRecipesUrl = useLastRecipesStore(state => state.lastRecipesUrl);

    useEffect(() => {
        void useLastRecipesStore.persist.rehydrate();
    }, []);

    return [
        { label: "Home", href: "/", icon: <HomeIcon /> },
        { label: "Przepisy", href: lastRecipesUrl ?? "/recipes", icon: <MenuBookIcon /> },
        { label: "Artykuły", href: "/blog", icon: <ArticleIcon /> },
        { label: "Ulubione", href: "/favorites", icon: <FavoriteIcon />, hidden: areFavoritesEmpty },
        { label: "O mnie", href: "/about", icon: <InfoIcon /> },
        { label: "Szukaj", href: "/search", icon: <SearchIcon /> },
    ];
};
