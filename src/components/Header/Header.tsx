// src/components/Header/Header.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Menu, RecipeFilters } from "@/components";
import { Book as RecipeIcon, Article as BlogIcon, Home as HomeIcon, Favorite as FavoriteIcon, Info as InfoIcon, Search as SearchIcon, Logout as LogoutIcon } from "@mui/icons-material";
import { Box, Button } from "@mui/material";
import { overlayStyles, modalStyles } from "./Header.styles";
import { useRecipesSummary } from "@/hooks";
import { Options } from "@/types";
import { useAdminStore } from "@/stores/useAdminStore";
import { useGoogleSignIn } from "@/hooks/useGoogleSignIn";

interface HeaderProps {
    initialSummary?: Options | null;
    fetchError?: string | null;
}

const Header = ({ initialSummary, fetchError }: HeaderProps) => {
    const [showFilter, setShowFilter] = useState(false);
    const { summary: options } = useRecipesSummary(initialSummary || undefined);
    const isFiltersLoaded = options.titles.length > 0;

    const isAdminLogged = useAdminStore(s => s.isAdminLogged);
    const setAdminLogged = useAdminStore(s => s.setAdminLogged);

    useGoogleSignIn();

    const navItems = [
        { label: "Home", href: "/", icon: <HomeIcon /> },
        { label: "Przepisy", href: "/recipes", icon: <RecipeIcon /> },
        { label: "Artykuły", href: "/blog", icon: <BlogIcon /> },
        { label: "Ulubione", href: "/favorites", icon: <FavoriteIcon /> },
        { label: "O mnie", href: "/about", icon: <InfoIcon /> },
        {
            label: "Szukaj",
            icon: <SearchIcon />,
            onClick: () => setShowFilter(true),
            hidden: !isFiltersLoaded,
        },
    ];

    // Naprawiony useEffect – poprawna składnia
    useEffect(() => {
        if (showFilter) {
            const handler = (e: KeyboardEvent) => {
                if (e.key === "Escape") {
                    setShowFilter(false);
                }
            };
            document.addEventListener("keydown", handler);
            return () => document.removeEventListener("keydown", handler);
        }
    }, [showFilter]);

    // Naprawiony useEffect – nie ma już "unused expression"
    useEffect(() => {
        if (fetchError) {
            console.error("Błąd z layoutu:", fetchError);
        }
    }, [fetchError]);

    return (
        <>
            <Menu navItems={navItems} />

            {/* Przycisk Google – niewidoczny, ale klikalny, bez żadnego białego paska */}
            {!isAdminLogged && (
                <Box
                    sx={{
                        position: "fixed",
                        inset: 0,
                        pointerEvents: "none",
                        zIndex: 9999,
                    }}
                >
                    <Box
                        sx={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            pointerEvents: "auto",
                        }}
                    >
                        <div id="google-signin-button" />
                    </Box>
                </Box>
            )}

            {/* Przycisk wylogowania – tylko gdy zalogowany */}
            {isAdminLogged && (
                <Box sx={{ position: "fixed", top: 16, right: 16, zIndex: 1300 }}>
                    <Button variant="contained" color="error" size="small" startIcon={<LogoutIcon />} onClick={() => setAdminLogged(false, "wylogowanie ręczne")}>
                        Wyloguj
                    </Button>
                </Box>
            )}

            {/* Filtry */}
            {showFilter && (
                <Box sx={overlayStyles} onClick={() => setShowFilter(false)}>
                    <Box sx={modalStyles} onClick={e => e.stopPropagation()}>
                        <RecipeFilters onFiltersChange={() => {}} onClose={() => setShowFilter(false)} options={options} />
                    </Box>
                </Box>
            )}
        </>
    );
};

export default Header;
