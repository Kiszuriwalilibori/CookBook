"use client";

import React, { useState } from "react";
import { AppBar, Toolbar, IconButton, List, ListItem, ListItemText, ListItemIcon, Box, Drawer } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Link from "next/link";

// Define the type for navItems
interface NavItem {
    label: string;
    href: string;
    icon: React.ReactElement;
}

// Define the props type for the Menu component
interface MenuProps {
    navItems: NavItem[];
}

const Menu: React.FC<MenuProps> = ({ navItems }) => {
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const drawer = (
        <Box sx={{ width: 250 }} className="bg-white text-black" onClick={handleDrawerToggle}>
            <List>
                {navItems.map(item => (
                    <Link href={item.href} key={item.label} passHref>
                        <ListItem className="hover:bg-gray-100 transition-colors duration-200 px-4 py-3">
                            <ListItemIcon className="text-black min-w-[40px]">{item.icon}</ListItemIcon>
                            <ListItemText primary={item.label} className="text-sm font-sans font-medium uppercase tracking-wide" />
                        </ListItem>
                    </Link>
                ))}
            </List>
        </Box>
    );

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar
                position="static"
                className="bg-menu-bg shadow-none border-b border-gray-200"
                elevation={0}
                sx={{ backgroundColor: "#F5F5F0" }} // Fallback to ensure beige background
            >
                <Toolbar className="justify-center py-4">
                    {/* Desktop Menu */}
                    <Box className="hidden md:flex items-center">
                        {navItems.map((item, index) => (
                            <React.Fragment key={item.label}>
                                <Link href={item.href} passHref>
                                    <Box className="flex items-center px-4 py-2 text-black hover:text-gray-500 transition-colors duration-200 cursor-pointer">
                                        <Box className="text-lg mr-2">{item.icon}</Box>
                                        <span className="text-sm font-sans font-medium uppercase tracking-wider">{item.label}</span>
                                    </Box>
                                </Link>
                                {index < navItems.length - 1 && <Box className="h-6 w-px bg-gray-300 mx-2" />}
                            </React.Fragment>
                        ))}
                    </Box>

                    {/* Mobile Menu Button */}
                    <IconButton color="inherit" aria-label="open drawer" edge="end" onClick={handleDrawerToggle} className="md:hidden text-black">
                        <MenuIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>

            {/* Mobile Drawer */}
            <Drawer anchor="right" open={mobileOpen} onClose={handleDrawerToggle} ModalProps={{ keepMounted: true }} className="md:hidden">
                {drawer}
            </Drawer>
        </Box>
    );
};

// Define default props
// Menu.defaultProps = {
//   navItems: [
//     { label: 'Home', href: '/', icon: <HomeIcon /> },
//     { label: 'Przepisy', href: '/recipes', icon: <RestaurantIcon /> },
//     { label: 'Artykuły', href: '/blog', icon: <ArticleIcon /> },
//     { label: 'Ulubione', href: '/favorites', icon: <FavoriteIcon /> },
//     { label: 'O mnie', href: '/about', icon: <InfoIcon /> },
//   ],
// };

export default Menu;
