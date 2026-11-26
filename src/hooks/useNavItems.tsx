// src/hooks/useNavItems.tsx
import React from "react";
import HomeIcon from "@mui/icons-material/Home";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import ArticleIcon from "@mui/icons-material/Article";
import FavoriteIcon from "@mui/icons-material/Favorite";
import InfoIcon from "@mui/icons-material/Info";
import SearchIcon from "@mui/icons-material/Search";
import { useRouter } from "next/navigation";
import { LastRecipes } from "@/utils/LastRecipes";

import { useFavoritesStore } from "@/stores/useFavoritesStore";

export type NavItem = {
    label: string;
    href?: string;
    icon: React.ReactNode;
    onClick?: () => void;
    hidden?: boolean;
};

export const useNavItems = (): NavItem[] => {
    const { areFavoritesEmpty } = useFavoritesStore();
    const router = useRouter();
    return [
        { label: "Home", href: "/", icon: <HomeIcon /> },
        {
            label: "Przepisy",
            href: "/recipes",
            icon: <MenuBookIcon />,
            onClick: () => router.push(LastRecipes.get() ?? "/recipes"),
        },
        // { label: "Przepisy", href: "/recipes", icon: <MenuBookIcon /> },
        { label: "Artykuły", href: "/blog", icon: <ArticleIcon /> },
        { label: "Ulubione", href: "/favorites", icon: <FavoriteIcon />, hidden: areFavoritesEmpty },
        { label: "O mnie", href: "/about", icon: <InfoIcon /> },
        { label: "Szukaj", href: "/search", icon: <SearchIcon /> },
    ];
};
