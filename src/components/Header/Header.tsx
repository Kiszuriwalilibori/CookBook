// src/components/Header/Header.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Menu } from "@/components";

import { useEscapeKey, useRecipesSummary, useGoogleSignIn, useNavItems } from "@/hooks";
import { RecipeFilter } from "@/types";

import GoogleLogoutButton from "./GoogleLogoutButton";
import GoogleSignInButton from "./GoogleSignInButton";
import { RecipeFiltersModal } from "./RecipeFiltersModal";

interface HeaderProps {
    initialSummary?: RecipeFilter | null;
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
            <RecipeFiltersModal open={showFilter} onClose={() => setShowFilter(false)} options={options} />
        </>
    );
};

export default Header;
