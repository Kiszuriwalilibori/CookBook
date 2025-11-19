// src/components/Header/Header.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Menu, RecipeFilters } from "@/components";
import { Logout as LogoutIcon } from "@mui/icons-material";
import { Box, Button } from "@mui/material";
import { overlayStyles, modalStyles, googleButtonOverlay, googleButtonWrapper, logoutButtonWrapper } from "./Header.styles";
import { useEscapeKey, useRecipesSummary, useGoogleSignIn, useNavItems } from "@/hooks";
import { Options } from "@/types";
import { useAdminStore } from "@/stores/useAdminStore";

interface HeaderProps {
    initialSummary?: Options | null;
    fetchError?: string | null;
}

const Header = ({ initialSummary, fetchError }: HeaderProps) => {
    const [showFilter, setShowFilter] = useState(false);
    const { summary: options } = useRecipesSummary(initialSummary || undefined);
    const isAdminLogged = useAdminStore(s => s.isAdminLogged);
    const setAdminLogged = useAdminStore(s => s.setAdminLogged);

    useGoogleSignIn();

    const navItems = useNavItems(initialSummary, () => setShowFilter(true));
    useEscapeKey(showFilter, () => setShowFilter(false));

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
                <Box sx={googleButtonOverlay}>
                    <Box sx={googleButtonWrapper}>
                        <div id="google-signin-button" />
                    </Box>
                </Box>
            )}

            {/* Przycisk wylogowania – tylko gdy zalogowany */}
            {isAdminLogged && (
                <Box sx={logoutButtonWrapper}>
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
