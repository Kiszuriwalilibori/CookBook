// src/components/Header/Header.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Menu, RecipeFilters } from "@/components";

import { Box } from "@mui/material";
import { overlayStyles, modalStyles } from "./Header.styles";
import { useEscapeKey, useRecipesSummary, useGoogleSignIn, useNavItems } from "@/hooks";
import { Options } from "@/types";

import GoogleLogoutButton from "./GoogleLogoutButton";
import GoogleSignInButton from "./GoogleSignInButton";

interface HeaderProps {
    initialSummary?: Options | null;
    fetchError?: string | null;
}

const Header = ({ initialSummary, fetchError }: HeaderProps) => {
    const [showFilter, setShowFilter] = useState(false);
    const { summary: options } = useRecipesSummary(initialSummary || undefined);

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

            <GoogleSignInButton />
        <GoogleLogoutButton />

            
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
