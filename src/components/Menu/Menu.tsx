"use client";

import React, { useRef } from "react";
import { AppBar, Box, IconButton, Toolbar } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

import { drawerButtonStyle, menuAppBarStyle, menuToolbarStyle, navigationStyle } from "./styles";

import MobileMenu from "./MobileMenu";
import DesktopMenu from "./DesktopMenu";

export interface NavItem {
    label: string;
    href?: string;
    icon: React.ReactNode;
    onClick?: () => void;
    hidden?: boolean;
}

interface MenuProps {
    navItems: NavItem[];
    mobileOpen: boolean;
    onMobileOpen: () => void;
    onMobileClose: () => void;
}

const Menu: React.FC<MenuProps> = ({ navItems, mobileOpen, onMobileOpen, onMobileClose }) => {
    const drawerButtonRef = useRef<HTMLButtonElement>(null);

    const visibleNavItems = navItems.filter(item => !item.hidden);

    const handleMobileClose = () => {
        onMobileClose();

        requestAnimationFrame(() => {
            drawerButtonRef.current?.focus();
        });
    };

    return (
        <Box component="nav" aria-label="Main navigation" sx={navigationStyle}>
            <AppBar position="static" sx={menuAppBarStyle} elevation={0}>
                <Toolbar sx={menuToolbarStyle}>
                    <DesktopMenu navItems={visibleNavItems} />

                    <IconButton id="hamburger" ref={drawerButtonRef} aria-label="Open navigation menu" aria-expanded={mobileOpen} aria-controls={mobileOpen ? "navigation-drawer" : undefined} edge="end" onClick={onMobileOpen} sx={drawerButtonStyle}>
                        <MenuIcon aria-hidden="true" />
                    </IconButton>
                </Toolbar>
            </AppBar>

            <MobileMenu navItems={visibleNavItems} open={mobileOpen} onClose={handleMobileClose} />
        </Box>
    );
};

export default Menu;
