"use client";

import React, { useState, useEffect } from "react";
import { Menu } from "@/components";

import { useGoogleSignIn, useNavItems } from "@/hooks";
import { RecipeFilter } from "@/types";

// import GoogleSignInButton from "./GoogleSignInButton";

import GoogleLogoutButton from "@/app/(main)/kiszuriwalilibori-admin-jestem/GoogleLogoutButton";

interface HeaderProps {
    initialSummary?: RecipeFilter | null;
    fetchError?: string | null;
}

const Header = ({ initialSummary, fetchError }: HeaderProps) => {
    const [ui, setUI] = useState({
        mobileMenuOpen: false,
    });

    useGoogleSignIn();

    const openMobileMenu = () => setUI(s => ({ ...s, mobileMenuOpen: true }));

    const closeMobileMenu = () => setUI(s => ({ ...s, mobileMenuOpen: false }));

    const navItems = useNavItems(initialSummary);

    useEffect(() => {
        if (fetchError) {
            console.error("Błąd z layoutu:", fetchError);
        }
    }, [fetchError]);

    return (
        <>
            <Menu navItems={navItems} mobileOpen={ui.mobileMenuOpen} onMobileOpen={openMobileMenu} onMobileClose={closeMobileMenu} />
            <GoogleLogoutButton />
        </>
    );
};

export default Header;
// todo kiedyś tam usunąć GLB, na razie przydatny testowo i tak widoczny tylko przy adminie zalogowanym
