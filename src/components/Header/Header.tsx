"use client";

import React, { useState, useEffect } from "react";
import { Menu, RecipeFilters } from "@/components";
import { Book as RecipeIcon, Article as BlogIcon, Home as HomeIcon, Favorite as FavoriteIcon, Info as InfoIcon, Search as SearchIcon } from "@mui/icons-material";
import { Box } from "@mui/material";
import { overlayStyles, modalStyles } from "./Header.styles";
import { useRecipesSummary } from "@/hooks";
import { Options } from "@/types";

interface HeaderProps {
    initialSummary?: Options | null;
    fetchError?: string | null;
}

const Header = ({ initialSummary, fetchError }: HeaderProps) => {
    const [showFilter, setShowFilter] = useState(false);
    const { summary: options, isLoading, error } = useRecipesSummary(initialSummary || undefined);
    console.log("isLoading, error", isLoading, error);

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
        hidden: !isFiltersLoaded,
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

    useEffect(() => {
        if (fetchError) {
            console.error("⚠️ Server-side fetch error (from RootLayout):", fetchError);
        }
    }, [fetchError]);

    return (
        <>
            <Menu navItems={navItems} />

            {showFilter && (
                <>
                    <Box sx={overlayStyles} onClick={handleClose}>
                        <Box sx={modalStyles} onClick={e => e.stopPropagation()}>
                            <RecipeFilters onFiltersChange={() => {} /*filters => console.log("Applied filters:", filters)*/} onClose={handleClose} options={options} />
                        </Box>
                    </Box>
                </>
            )}
        </>
    );
};

export default Header;
