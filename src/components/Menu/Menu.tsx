"use client";

import React, { useState } from "react";
import { AppBar, Toolbar, IconButton, List, ListItem, ListItemText, ListItemIcon, Box, Drawer, Typography, ListItemButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { desktopItemStyles, desktopMenuContainerStyle, desktopMenuIconStyle, desktopMenuLabelStyle, desktopMenuSeparatorStyle, drawerButtonStyle, drawerBoxStyle, menuAppBarStyle, menuToolbarStyle, mobileMenuIconStyle, mobileMenuItemStyle, drawerStyle, navigationStyle } from "./styles";

export interface NavItem {
    label: string;
    href?: string;
    icon: React.ReactNode;
    onClick?: () => void;
    hidden?: boolean; 
}

interface MenuProps {
    navItems: NavItem[];
}

const Menu: React.FC<MenuProps> = ({ navItems }) => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const currentPathname = usePathname();

    const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

    const drawer = (
        <Box sx={drawerBoxStyle}>
            <List>
                {navItems.map(item => (
                    <React.Fragment key={item.label}>
                        {item.href ? (
                            <ListItem
                                component={Link}
                                href={item.href}
                                aria-label={`Navigate to ${item.label}`}
                                sx={{
                                    ...mobileMenuItemStyle(currentPathname, item.href),
                                    opacity: item.hidden ? 0 : 1,
                                    transform: item.hidden ? "translateX(20px)" : "translateX(0)",
                                    transition: "opacity 0.4s ease, transform 0.4s ease",
                                    pointerEvents: item.hidden ? "none" : "auto",
                                }}
                            >
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
                            <ListItemButton
                                onClick={item.onClick}
                                sx={{
                                    ...mobileMenuItemStyle(currentPathname, ""),
                                    opacity: item.hidden ? 0 : 1,
                                    transform: item.hidden ? "translateX(20px)" : "translateX(0)",
                                    transition: "opacity 0.4s ease, transform 0.4s ease",
                                    pointerEvents: item.hidden ? "none" : "auto",
                                }}
                            >
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
                ))}
            </List>
        </Box>
    );

    return (
        <Box role="navigation" sx={navigationStyle}>
            <AppBar position="static" sx={menuAppBarStyle} elevation={0}>
                <Toolbar sx={menuToolbarStyle}>
                    <Box sx={desktopMenuContainerStyle}>
                        {navItems.map((item, index) => (
                            <React.Fragment key={item.label}>
                                {item.href ? (
                                    <Box
                                        component={Link}
                                        href={item.href}
                                        sx={{
                                            ...desktopItemStyles(currentPathname, item.href),
                                            opacity: item.hidden ? 0 : 1,
                                            transform: item.hidden ? "translateX(20px)" : "translateX(0)",
                                            transition: "opacity 0.4s ease, transform 0.4s ease",
                                            pointerEvents: item.hidden ? "none" : "auto",
                                        }}
                                    >
                                        <Box component="span" sx={desktopMenuIconStyle}>
                                            {item.icon}
                                        </Box>
                                        <Typography component="span" sx={desktopMenuLabelStyle}>
                                            {item.label.trim()}
                                        </Typography>
                                    </Box>
                                ) : (
                                    <Box
                                        sx={{
                                            ...desktopItemStyles(currentPathname, ""),
                                            opacity: item.hidden ? 0 : 1,
                                            transform: item.hidden ? "translateX(20px)" : "translateX(0)",
                                            transition: "opacity 0.4s ease, transform 0.4s ease",
                                            pointerEvents: item.hidden ? "none" : "auto",
                                        }}
                                        onClick={item.onClick}
                                        role="button"
                                        tabIndex={0}
                                        onKeyDown={e => e.key === "Enter" && item.onClick?.()}
                                    >
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
                        ))}
                    </Box>

                    <IconButton aria-label="open drawer" edge="end" onClick={handleDrawerToggle} sx={drawerButtonStyle}>
                        <MenuIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>

            <Drawer anchor="top" open={mobileOpen} onClose={handleDrawerToggle} ModalProps={{ keepMounted: true }} aria-labelledby="menu-drawer" sx={drawerStyle}>
                {drawer}
            </Drawer>
        </Box>
    );
};

export default Menu;
