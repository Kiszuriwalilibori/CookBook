"use client";

import React, { useState, useEffect } from "react";
import { Menu, RecipeFilters } from "@/components";
import { Book as RecipeIcon, Article as BlogIcon, Home as HomeIcon, Favorite as FavoriteIcon, Info as InfoIcon, Search as SearchIcon } from "@mui/icons-material";
import { Box } from "@mui/material";
import { overlayStyles, modalStyles } from "./Header.styles";
import { useRecipeFilterOptions } from "@/hooks";

const Header = () => {
    const [showFilter, setShowFilter] = useState(false);
    const options = useRecipeFilterOptions();
    const isFiltersLoaded = options.titles.length > 0;

    const commonNavItems = [
        { label: "Home", href: "/", icon: <HomeIcon /> },
        { label: "Przepisy", href: "/recipes", icon: <RecipeIcon /> },
        { label: "Artykuły", href: "/blog", icon: <BlogIcon /> },
        { label: "Ulubione", href: "/favorites", icon: <FavoriteIcon /> },
        { label: "O mnie", href: "/about", icon: <InfoIcon /> },
    ];

    const searchNavItem = {
        label: "Szukaj",
        icon: <SearchIcon />,
        onClick: () => setShowFilter(true),
        hidden: !isFiltersLoaded, // 👈 this controls animation visibility
    };

    const navItems = [...commonNavItems, searchNavItem];

    const handleClose = () => setShowFilter(false);

    useEffect(() => {
        if (showFilter) {
            const handleEsc = (e: KeyboardEvent) => e.key === "Escape" && handleClose();
            document.addEventListener("keydown", handleEsc);
            return () => document.removeEventListener("keydown", handleEsc);
        }
    }, [showFilter]);

    return (
        <>
            <Menu navItems={navItems} />

            {showFilter && (
                <>
                    <Box sx={overlayStyles} onClick={handleClose}>
                        <Box sx={modalStyles} onClick={e => e.stopPropagation()}>
                            <RecipeFilters onFiltersChange={filters => console.log("Applied filters:", filters)} onClose={handleClose} />
                        </Box>
                    </Box>
                </>
            )}
        </>
    );
};

export default Header;
