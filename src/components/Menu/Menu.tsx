// "use client";

// import React, { useState } from "react";
// import { AppBar, Toolbar, IconButton, List, ListItem, ListItemText, ListItemIcon, Box, Drawer, Typography } from "@mui/material";
// import MenuIcon from "@mui/icons-material/Menu";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { desktopItemStyles, desktopMenuContainerStyle, desktopMenuIconStyle, desktopMenuLabelStyle, desktopMenuSeparatorStyle, drawerButtonStyle, drawerBoxStyle, menuAppBarStyle, menuToolbarStyle, mobileMenuIconStyle, mobileMenuItemStyle, drawerStyle, navigationStyle } from "./styles";

// // interface NavItem {
// //     label: string;
// //     href: string;
// //     icon: React.ReactElement;
// // }
// export interface NavItem {
//     label: string;
//     href?: string; // Optional for non-link items
//     icon: ReactNode;
//     onClick?: () => void; // Optional handler for interactive items
// }

// interface MenuProps {
//     navItems: NavItem[];
// }

// const Menu: React.FC<MenuProps> = ({ navItems }) => {
//     const [mobileOpen, setMobileOpen] = useState(false);
//     const currentPathname = usePathname();

//     const handleDrawerToggle = () => {
//         setMobileOpen(!mobileOpen);
//     };

//     const drawer = (
//         <Box sx={drawerBoxStyle}>
//             <List>
//                 {navItems.map(item => (
//                     <Link href={item.href} key={item.label} passHref>
//                         <ListItem aria-label={`Navigate to ${item.label}`} sx={mobileMenuItemStyle(currentPathname, item.href)}>
//                             <ListItemIcon sx={mobileMenuIconStyle}>{item.icon}</ListItemIcon>
//                             <ListItemText
//                                 primary={item.label.trim()}
//                                 slotProps={{
//                                     primary: {
//                                         sx: {
//                                             ...desktopMenuLabelStyle,
//                                             fontWeight: currentPathname === item.href ? 700 : 500,
//                                         },
//                                     },
//                                 }}
//                             />
//                         </ListItem>
//                     </Link>
//                 ))}
//             </List>
//         </Box>
//     );

//     return (
//         <Box role="navigation" sx={navigationStyle}>
//             <AppBar position="static" sx={menuAppBarStyle} elevation={0}>
//                 <Toolbar sx={menuToolbarStyle}>
//                     <Box sx={desktopMenuContainerStyle}>
//                         {navItems.map((item, index) => (
//                             <React.Fragment key={item.label}>
//                                 <Link href={item.href} passHref>
//                                     <Box sx={desktopItemStyles(currentPathname, item.href)}>
//                                         <Box component="span" sx={desktopMenuIconStyle}>
//                                             {item.icon}
//                                         </Box>
//                                         <Typography component="span" sx={desktopMenuLabelStyle}>
//                                             {item.label.trim()}
//                                         </Typography>
//                                     </Box>
//                                 </Link>
//                                 {index < navItems.length - 1 && <Box sx={desktopMenuSeparatorStyle} />}
//                             </React.Fragment>
//                         ))}
//                     </Box>
//                     <IconButton aria-label="open drawer" edge="end" onClick={handleDrawerToggle} sx={drawerButtonStyle}>
//                         <MenuIcon />
//                     </IconButton>
//                 </Toolbar>
//             </AppBar>
//             <Drawer anchor="top" open={mobileOpen} onClose={handleDrawerToggle} ModalProps={{ keepMounted: true }} aria-labelledby="menu-drawer" sx={drawerStyle}>
//                 {drawer}
//             </Drawer>
//         </Box>
//     );
// };

// export default Menu;

// components/Menu/Menu.tsx
// components/Menu/Menu.tsx (your original + minimal changes)
// components/Menu/Menu.tsx
// components/Menu/Menu.tsx
// components/Menu/Menu.tsx
"use client";

import React, { useState } from "react";
import { AppBar, Toolbar, IconButton, List, ListItem, ListItemText, ListItemIcon, Box, Drawer, Typography, ListItemButton } from "@mui/material"; // Add ListItemButton import
import MenuIcon from "@mui/icons-material/Menu";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { desktopItemStyles, desktopMenuContainerStyle, desktopMenuIconStyle, desktopMenuLabelStyle, desktopMenuSeparatorStyle, drawerButtonStyle, drawerBoxStyle, menuAppBarStyle, menuToolbarStyle, mobileMenuIconStyle, mobileMenuItemStyle, drawerStyle, navigationStyle } from "./styles";

// Updated interface
export interface NavItem {
    label: string;
    href?: string;
    icon: ReactNode;
    onClick?: () => void;
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
                    <React.Fragment key={item.label}>
                        {item.href ? (
                            <Link href={item.href} passHref legacyBehavior>
                                <ListItem aria-label={`Navigate to ${item.label}`} component="a" sx={mobileMenuItemStyle(currentPathname, item.href)}>
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
                        ) : (
                            <ListItemButton
                                onClick={item.onClick}
                                sx={mobileMenuItemStyle(currentPathname, "")} // Fallback for style
                                selected={false} // Explicit false for non-links
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
                                    <Link href={item.href} passHref legacyBehavior>
                                        <Box component="a" sx={desktopItemStyles(currentPathname, item.href)}>
                                            <Box component="span" sx={desktopMenuIconStyle}>
                                                {item.icon}
                                            </Box>
                                            <Typography component="span" sx={desktopMenuLabelStyle}>
                                                {item.label.trim()}
                                            </Typography>
                                        </Box>
                                    </Link>
                                ) : (
                                    <Box
                                        sx={desktopItemStyles(currentPathname, "")} // Fallback
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
