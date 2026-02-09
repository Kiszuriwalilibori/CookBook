"use client";

import React from "react";
import { AppBar, Toolbar, IconButton, List, ListItem, ListItemText, ListItemIcon, Box, Drawer, Typography, ListItemButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    desktopItemStyles,
    desktopMenuContainerStyle,
    desktopMenuIconStyle,
    desktopMenuLabelStyle,
    desktopMenuSeparatorStyle,
    drawerButtonStyle,
    drawerBoxStyle,
    menuAppBarStyle,
    menuToolbarStyle,
    mobileMenuIconStyle,
    mobileMenuItemStyle,
    drawerStyle,
    navigationStyle,
    mobileMenuItemButtonStyle,
} from "./styles";

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
    const currentPathname = usePathname();

    const handleMobileItemClick = (action?: () => void) => {
        action?.();
        onMobileClose();
    };

    // --- MOBILE DRAWER ---
    const drawer = (
        <Box sx={drawerBoxStyle}>
            <List>
                {navItems.map(
                    item =>
                        !item.hidden && (
                            <React.Fragment key={item.label}>
                                {item.href ? (
                                    <ListItem component={Link} href={item.href} aria-label={`Navigate to ${item.label}`} onClick={() => handleMobileItemClick()} sx={mobileMenuItemStyle(currentPathname, item.href)}>
                                        <ListItemIcon sx={mobileMenuIconStyle}>{item.icon}</ListItemIcon>
                                        <ListItemText
                                            primary={item.label.trim()}
                                            slotProps={{
                                                primary: {
                                                    sx: {
                                                        ...desktopMenuLabelStyle,
                                                        fontWeight: currentPathname === item.href ? 700 : 500,
                                                    },
                                                },
                                            }}
                                        />
                                    </ListItem>
                                ) : (
                                    <ListItemButton onClick={() => handleMobileItemClick(item.onClick)} sx={mobileMenuItemButtonStyle(currentPathname)}>
                                        <ListItemIcon sx={mobileMenuIconStyle}>{item.icon}</ListItemIcon>
                                        <ListItemText
                                            primary={item.label.trim()}
                                            slotProps={{
                                                primary: {
                                                    sx: {
                                                        ...desktopMenuLabelStyle,
                                                        fontWeight: 500,
                                                    },
                                                },
                                            }}
                                        />
                                    </ListItemButton>
                                )}
                            </React.Fragment>
                        )
                )}
            </List>
        </Box>
    );

    // --- DESKTOP MENU ---
    return (
        <Box role="navigation" sx={navigationStyle}>
            <AppBar position="static" sx={menuAppBarStyle} elevation={0}>
                <Toolbar sx={menuToolbarStyle}>
                    <Box sx={desktopMenuContainerStyle}>
                        {navItems.map(
                            (item, index) =>
                                !item.hidden && (
                                    <React.Fragment key={item.label}>
                                        {item.href ? (
                                            <Box component={Link} href={item.href} sx={desktopItemStyles(currentPathname, "")}>
                                                <Box component="span" sx={desktopMenuIconStyle}>
                                                    {item.icon}
                                                </Box>
                                                <Typography component="span" sx={desktopMenuLabelStyle}>
                                                    {item.label.trim()}
                                                </Typography>
                                            </Box>
                                        ) : (
                                            <Box sx={desktopItemStyles(currentPathname, "")} onClick={item.onClick} role="button" tabIndex={0} onKeyDown={e => e.key === "Enter" && item.onClick?.()}>
                                                <Box component="span" sx={desktopMenuIconStyle}>
                                                    {item.icon}
                                                </Box>
                                                <Typography component="span" sx={desktopMenuLabelStyle}>
                                                    {item.label.trim()}
                                                </Typography>
                                            </Box>
                                        )}
                                        {index < navItems.length - 1 && <Box sx={desktopMenuSeparatorStyle} />}
                                    </React.Fragment>
                                )
                        )}
                    </Box>

                    <IconButton aria-label="open drawer" edge="end" onClick={onMobileOpen} sx={drawerButtonStyle}>
                        <MenuIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>

            <Drawer anchor="top" open={mobileOpen} onClose={onMobileClose} ModalProps={{ keepMounted: true }} sx={drawerStyle}>
                {drawer}
            </Drawer>
        </Box>
    );
};

export default Menu;
