"use client";

import React, { useRef } from "react";
import { Box, ButtonBase, Typography } from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { desktopItemStyles, desktopMenuContainerStyle, desktopMenuIconStyle, desktopMenuLabelStyle, desktopMenuSeparatorStyle } from "./styles";
import { focusableSx } from "@/styles/utilityStyles";
import type { NavItem } from "./Menu";

interface DesktopMenuProps {
    navItems: NavItem[];
}

const DesktopMenu: React.FC<DesktopMenuProps> = ({ navItems }) => {
    const currentPathname = usePathname();
    const desktopItemRefs = useRef<Array<HTMLElement | null>>([]);

    const isCurrentItem = (href?: string) => Boolean(href && currentPathname === href);

    const moveFocus = (currentIndex: number, direction: "next" | "previous" | "first" | "last") => {
        const items = desktopItemRefs.current.filter(Boolean) as HTMLElement[];

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

            default:
                break;
        }
    };

    return (
        <Box sx={desktopMenuContainerStyle}>
            {navItems.map((item, index) => {
                const current = isCurrentItem(item.href);

                const commonProps = {
                    ref: (element: HTMLElement | null) => {
                        desktopItemRefs.current[index] = element;
                    },
                    onKeyDown: (event: React.KeyboardEvent<HTMLElement>) => handleKeyDown(event, index),
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
                                <Box component="span" sx={desktopMenuIconStyle} aria-hidden="true">
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
                                <Box component="span" sx={desktopMenuIconStyle} aria-hidden="true">
                                    {item.icon}
                                </Box>

                                <Typography component="span" sx={desktopMenuLabelStyle}>
                                    {item.label.trim()}
                                </Typography>
                            </ButtonBase>
                        )}

                        {index < navItems.length - 1 && <Box aria-hidden="true" sx={desktopMenuSeparatorStyle} />}
                    </React.Fragment>
                );
            })}
        </Box>
    );
};

export default DesktopMenu;
