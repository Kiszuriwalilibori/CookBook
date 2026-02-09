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
    const [ui, setUI] = useState({
        mobileMenuOpen: false,
        filterOpen: false,
    });

    const { summary: options } = useRecipesSummary(initialSummary || undefined);

    useGoogleSignIn();

    const openMobileMenu = () => setUI(s => ({ ...s, mobileMenuOpen: true }));

    const closeMobileMenu = () => setUI(s => ({ ...s, mobileMenuOpen: false }));

    const openFilters = () => setUI({ mobileMenuOpen: false, filterOpen: true });

    const closeFilters = () => setUI(s => ({ ...s, filterOpen: false }));

    const navItems = useNavItems(initialSummary, openFilters);

    useEscapeKey(ui.filterOpen, closeFilters);

    useEffect(() => {
        if (fetchError) {
            console.error("Błąd z layoutu:", fetchError);
        }
    }, [fetchError]);

    return (
        <>
            <Menu navItems={navItems} mobileOpen={ui.mobileMenuOpen} onMobileOpen={openMobileMenu} onMobileClose={closeMobileMenu} />

            <GoogleSignInButton />
            <GoogleLogoutButton />

            <RecipeFiltersModal open={ui.filterOpen} onClose={closeFilters} options={options} />
        </>
    );
};

export default Header;
