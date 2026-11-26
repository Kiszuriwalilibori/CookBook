"use client";

import React, { useState } from "react";
import { Menu } from "@/components";
import { useNavItems } from "@/hooks";

import GoogleLogoutButton from "@/app/(main)/kiszuriwalilibori-admin-jestem/GoogleLogoutButton";

const Header = () => {
    const [ui, setUI] = useState({
        mobileMenuOpen: false,
    });

    const openMobileMenu = () => setUI(s => ({ ...s, mobileMenuOpen: true }));

    const closeMobileMenu = () => setUI(s => ({ ...s, mobileMenuOpen: false }));

    const navItems = useNavItems();

    return (
        <>
            <Menu navItems={navItems} mobileOpen={ui.mobileMenuOpen} onMobileOpen={openMobileMenu} onMobileClose={closeMobileMenu} />
            <GoogleLogoutButton />
        </>
    );
};

export default Header;
