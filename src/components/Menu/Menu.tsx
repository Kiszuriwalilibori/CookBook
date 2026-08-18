"use client";

import React, { useEffect, useRef } from "react";
import { AppBar, Toolbar, IconButton, List, ListItem, ListItemText, ListItemIcon, Box, Drawer, Typography, ListItemButton, ButtonBase } from "@mui/material";
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
import { focusableSx, touchableSx } from "@/styles/utilityStyles";

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

    const visibleNavItems = navItems.filter(item => !item.hidden);

    const drawerButtonRef = useRef<HTMLButtonElement>(null);
    const mobileItemRefs = useRef<Array<HTMLElement | null>>([]);
    const desktopItemRefs = useRef<Array<HTMLElement | null>>([]);

    const isCurrentItem = (href?: string) => Boolean(href && currentPathname === href);

    const handleMobileItemClick = (action?: () => void) => {
        action?.();
        onMobileClose();
    };

    const moveFocus = (refs: React.MutableRefObject<Array<HTMLElement | null>>, currentIndex: number, direction: "next" | "previous" | "first" | "last") => {
        const items = refs.current.filter(Boolean) as HTMLElement[];

        if (!items.length) {
            return;
        }

        let nextIndex: number;

        switch (direction) {
            case "next":
                nextIndex = (currentIndex + 1) % items.length;
                break;

            case "previous":
                nextIndex = (currentIndex - 1 + items.length) % items.length;
                break;

            case "first":
                nextIndex = 0;
                break;

            case "last":
                nextIndex = items.length - 1;
                break;
        }

        items[nextIndex]?.focus();
    };

    const handleNavigationKeyDown = (event: React.KeyboardEvent<HTMLElement>, index: number, refs: React.MutableRefObject<Array<HTMLElement | null>>, onEscape?: () => void) => {
        switch (event.key) {
            case "ArrowDown":
            case "ArrowRight":
                event.preventDefault();
                moveFocus(refs, index, "next");
                break;

            case "ArrowUp":
            case "ArrowLeft":
                event.preventDefault();
                moveFocus(refs, index, "previous");
                break;

            case "Home":
                event.preventDefault();
                moveFocus(refs, index, "first");
                break;

            case "End":
                event.preventDefault();
                moveFocus(refs, index, "last");
                break;

            case "Escape":
                if (onEscape) {
                    event.preventDefault();
                    onEscape();
                }
                break;

            default:
                break;
        }
    };

    useEffect(() => {
        if (!mobileOpen) {
            return;
        }

        const firstItem = mobileItemRefs.current.find(Boolean);

        firstItem?.focus();
    }, [mobileOpen]);

    const handleMobileClose = () => {
        onMobileClose();

        requestAnimationFrame(() => {
            drawerButtonRef.current?.focus();
        });
    };

    const renderMobileItem = (item: NavItem, index: number) => {
        const current = isCurrentItem(item.href);

        const commonProps = {
            onKeyDown: (event: React.KeyboardEvent<HTMLElement>) => handleNavigationKeyDown(event, index, mobileItemRefs, handleMobileClose),
            sx: {
                ...touchableSx,
                ...focusableSx,
            },
        };

        if (item.href) {
            return (
                <ListItem key={item.label} disablePadding>
                    <ListItemButton
                        {...commonProps}
                        ref={element => {
                            mobileItemRefs.current[index] = element;
                        }}
                        component={Link}
                        href={item.href}
                        aria-current={current ? "page" : undefined}
                        onClick={() => handleMobileItemClick()}
                        sx={{
                            ...mobileMenuItemStyle(currentPathname, item.href),
                            ...touchableSx,
                            ...focusableSx,
                        }}
                    >
                        <ListItemIcon sx={mobileMenuIconStyle}>{item.icon}</ListItemIcon>

                        <ListItemText
                            primary={item.label.trim()}
                            slotProps={{
                                primary: {
                                    sx: {
                                        ...desktopMenuLabelStyle,
                                        fontWeight: current ? 700 : 500,
                                    },
                                },
                            }}
                        />
                    </ListItemButton>
                </ListItem>
            );
        }

        return (
            <ListItem key={item.label} disablePadding>
                <ListItemButton
                    {...commonProps}
                    ref={element => {
                        mobileItemRefs.current[index] = element;
                    }}
                    onClick={() => handleMobileItemClick(item.onClick)}
                    sx={{
                        ...mobileMenuItemButtonStyle(currentPathname),
                        ...touchableSx,
                        ...focusableSx,
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
            </ListItem>
        );
    };

    return (
        <Box component="nav" aria-label="Main navigation" sx={navigationStyle}>
            <AppBar position="static" sx={menuAppBarStyle} elevation={0}>
                <Toolbar sx={menuToolbarStyle}>
                    <Box sx={desktopMenuContainerStyle}>
                        {visibleNavItems.map((item, index) => {
                            const current = isCurrentItem(item.href);

                            const commonProps = {
                                ref: (element: HTMLElement | null) => {
                                    desktopItemRefs.current[index] = element;
                                },
                                onKeyDown: (event: React.KeyboardEvent<HTMLElement>) => handleNavigationKeyDown(event, index, desktopItemRefs),
                            };

                            return (
                                <React.Fragment key={item.label}>
                                    {item.href ? (
                                        <Box
                                            {...commonProps}
                                            component={Link}
                                            href={item.href}
                                            aria-current={current ? "page" : undefined}
                                            sx={{
                                                ...desktopItemStyles(currentPathname, ""),
                                                ...focusableSx,
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
                                        <ButtonBase
                                            {...commonProps}
                                            sx={{
                                                ...desktopItemStyles(currentPathname, ""),
                                                ...focusableSx,
                                            }}
                                            onClick={item.onClick}
                                        >
                                            <Box component="span" sx={desktopMenuIconStyle}>
                                                {item.icon}
                                            </Box>

                                            <Typography component="span" sx={desktopMenuLabelStyle}>
                                                {item.label.trim()}
                                            </Typography>
                                        </ButtonBase>
                                    )}

                                    {index < visibleNavItems.length - 1 && <Box aria-hidden="true" sx={desktopMenuSeparatorStyle} />}
                                </React.Fragment>
                            );
                        })}
                    </Box>

                    <IconButton ref={drawerButtonRef} aria-label="Open navigation menu" aria-expanded={mobileOpen} aria-controls={mobileOpen ? "navigation-drawer" : undefined} edge="end" onClick={onMobileOpen} sx={drawerButtonStyle}>
                        <MenuIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>

            <Drawer id="navigation-drawer" anchor="top" aria-label="Navigation menu" open={mobileOpen} onClose={handleMobileClose} sx={drawerStyle}>
                <Box sx={drawerBoxStyle}>
                    <List>{visibleNavItems.map(renderMobileItem)}</List>
                </Box>
            </Drawer>
        </Box>
    );
};

export default Menu;
