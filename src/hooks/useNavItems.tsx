// // src/hooks/useNavItems.ts
// import HomeIcon from "@mui/icons-material/Home";
// import MenuBookIcon from "@mui/icons-material/MenuBook";
// import ArticleIcon from "@mui/icons-material/Article";
// import FavoriteIcon from "@mui/icons-material/Favorite";
// import InfoIcon from "@mui/icons-material/Info";
// import SearchIcon from "@mui/icons-material/Search";

// import { useRecipesSummary } from "@/hooks";
// import { Options } from "@/types";

// type NavItem = { label: string; href: string; icon: React.ReactNode } | { label: string; icon: React.ReactNode; onClick: () => void; hidden?: boolean };

// export const useNavItems = (initialSummary?: Options | null, onSearchClick?: () => void): readonly NavItem[] => {
//     const { summary: options } = useRecipesSummary(initialSummary || undefined);
//     const isFiltersLoaded = options.titles.length > 0;

//     return [
//         { label: "Home", href: "/", icon: <HomeIcon /> },
//         { label: "Przepisy", href: "/recipes", icon: <MenuBookIcon /> },
//         { label: "Artykuły", href: "/blog", icon: <ArticleIcon /> },
//         { label: "Ulubione", href: "/favorites", icon: <FavoriteIcon /> },
//         { label: "O mnie", href: "/about", icon: <InfoIcon /> },
//         {
//             label: "Szukaj",
//             icon: <SearchIcon />,
//             onClick: onSearchClick ?? (() => {}),
//             hidden: !isFiltersLoaded,
//         },
//     ] as const;
// };


// src/hooks/useNavItems.tsx
import React from "react";
import HomeIcon from "@mui/icons-material/Home";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import ArticleIcon from "@mui/icons-material/Article";
import FavoriteIcon from "@mui/icons-material/Favorite";
import InfoIcon from "@mui/icons-material/Info";
import SearchIcon from "@mui/icons-material/Search";

import { useRecipesSummary } from "@/hooks";
import { RecipeFilter} from "@/types";

// Typ dokładnie taki, jaki oczekuje Twój komponent <Menu />
export type NavItem = {
  label: string;
  href?: string;
  icon: React.ReactNode;
  onClick?: () => void;
  hidden?: boolean;
};

export const useNavItems = (
  initialSummary?: RecipeFilter | null,
  onSearchClick?: () => void
): NavItem[] => {
  const { summary: options } = useRecipesSummary(initialSummary || undefined);
  const isFiltersLoaded = options.title.length > 0;

  return [
    { label: "Home", href: "/", icon: <HomeIcon /> },
    { label: "Przepisy", href: "/recipes", icon: <MenuBookIcon /> },
    { label: "Artykuły", href: "/blog", icon: <ArticleIcon /> },
    { label: "Ulubione", href: "/favorites", icon: <FavoriteIcon /> },
    { label: "O mnie", href: "/about", icon: <InfoIcon /> },
    {
      label: "Szukaj",
      icon: <SearchIcon />,
      onClick: onSearchClick,
      hidden: !isFiltersLoaded,
    },
  ];
};