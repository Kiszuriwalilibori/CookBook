"use client";

import React, { useState } from "react";
import { AppBar, Toolbar, IconButton, List, ListItem, ListItemText, ListItemIcon, Box, Drawer, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { desktopItemStyles, desktopMenuContainerStyle, desktopMenuIconStyle, desktopMenuLabelStyle, desktopMenuSeparatorStyle, drawerButtonStyle, drawerBoxStyle, menuAppBarStyle, menuToolbarStyle, mobileMenuIconStyle, mobileMenuItemStyle, drawerStyle, navigationStyle } from "./styles";

interface NavItem {
    label: string;
    href: string;
    icon: React.ReactElement;
}

interface MenuProps {
    navItems: NavItem[];
}

const Menu: React.FC<MenuProps> = ({ navItems }) => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const currentPathname = usePathname();

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const drawer = (
        <Box sx={drawerBoxStyle}>
            <List>
                {navItems.map(item => (
                    <Link href={item.href} key={item.label} passHref>
                        <ListItem aria-label={`Navigate to ${item.label}`} sx={mobileMenuItemStyle(currentPathname, item.href)}>
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
                    </Link>
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
                                <Link href={item.href} passHref>
                                    <Box sx={desktopItemStyles(currentPathname, item.href)}>
                                        <Box component="span" sx={desktopMenuIconStyle}>
                                            {item.icon}
                                        </Box>
                                        <Typography component="span" sx={desktopMenuLabelStyle}>
                                            {item.label.trim()}
                                        </Typography>
                                    </Box>
                                </Link>
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
