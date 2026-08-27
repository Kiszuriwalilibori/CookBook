"use client";

import React, { useEffect, useRef } from "react";
import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { drawerBoxStyle, drawerStyle, mobileMenuIconStyle, mobileMenuItemButtonStyle, mobileMenuItemStyle } from "./styles";
import { desktopMenuLabelStyle } from "./styles";
import { focusableSx, touchableSx } from "@/styles/utilityStyles";
import type { NavItem } from "./Menu";

interface MobileMenuProps {
    navItems: NavItem[];
    open: boolean;
    onClose: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ navItems, open, onClose }) => {
    const currentPathname = usePathname();
    const mobileItemRefs = useRef<Array<HTMLElement | null>>([]);

    const isCurrentItem = (href?: string) => Boolean(href && currentPathname === href);
    const handleDrawerEntered = () => {
        const firstItem = mobileItemRefs.current.find(Boolean);
        firstItem?.focus();
    };

    const moveFocus = (currentIndex: number, direction: "next" | "previous" | "first" | "last") => {
        const items = mobileItemRefs.current.filter(Boolean) as HTMLElement[];

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

    const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>, index: number) => {
        switch (event.key) {
            case "ArrowDown":
            case "ArrowRight":
                event.preventDefault();
                moveFocus(index, "next");
                break;

            case "ArrowUp":
            case "ArrowLeft":
                event.preventDefault();
                moveFocus(index, "previous");
                break;

            case "Home":
                event.preventDefault();
                moveFocus(index, "first");
                break;

            case "End":
                event.preventDefault();
                moveFocus(index, "last");
                break;

            case "Escape":
                event.preventDefault();
                onClose();
                break;

            default:
                break;
        }
    };

    useEffect(() => {
        if (!open) {
            return;
        }

        const frame = requestAnimationFrame(() => {
            const firstItem = mobileItemRefs.current.find(Boolean);
            firstItem?.focus();
        });

        return () => cancelAnimationFrame(frame);
    }, [open]);

    const handleItemClick = (action?: () => void) => {
        action?.();
        onClose();
    };

    const renderItem = (item: NavItem, index: number) => {
        const current = isCurrentItem(item.href);

        const itemSx = {
            ...touchableSx,
            ...focusableSx,
        };

        if (item.href) {
            return (
                <ListItem key={item.label} disablePadding>
                    <ListItemButton
                        ref={element => {
                            mobileItemRefs.current[index] = element;
                        }}
                        component={Link}
                        href={item.href}
                        aria-current={current ? "page" : undefined}
                        onClick={() => handleItemClick()}
                        onKeyDown={event => handleKeyDown(event, index)}
                        sx={{
                            ...mobileMenuItemStyle(currentPathname, item.href),
                            ...itemSx,
                        }}
                    >
                        <ListItemIcon sx={mobileMenuIconStyle} aria-hidden="true">
                            {item.icon}
                        </ListItemIcon>

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
                    ref={element => {
                        mobileItemRefs.current[index] = element;
                    }}
                    onClick={() => handleItemClick(item.onClick)}
                    onKeyDown={event => handleKeyDown(event, index)}
                    sx={{
                        ...mobileMenuItemButtonStyle(currentPathname),
                        ...itemSx,
                    }}
                >
                    <ListItemIcon sx={mobileMenuIconStyle} aria-hidden="true">
                        {item.icon}
                    </ListItemIcon>

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
        <Drawer
            id="navigation-drawer"
            anchor="top"
            aria-label="Navigation menu"
            open={open}
            onClose={onClose}
            sx={drawerStyle}
            // disableEnforceFocus
            disableAutoFocus
            slotProps={{
                transition: {
                    onEntered: handleDrawerEntered,
                },
            }}
        >
            <Box sx={drawerBoxStyle}>
                <List>{navItems.map(renderItem)}</List>
            </Box>
        </Drawer>
    );
};

export default MobileMenu;
