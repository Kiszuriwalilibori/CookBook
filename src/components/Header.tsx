"use client";

import React, { useState, useEffect } from "react";
import Menu from "@/components/Menu/Menu";
import RecipeFilters from "@/components/RecipeFilters";

import { Book as RecipeIcon, Article as BlogIcon, Home as HomeIcon, Favorite as FavoriteIcon, Info as InfoIcon, Search as SearchIcon } from "@mui/icons-material";
import { Box } from "@mui/material";

const Header = () => {
    const [showFilter, setShowFilter] = useState(false);

    const navItems = [
        { label: "Home", href: "/", icon: <HomeIcon /> },
        { label: "Przepisy", href: "/recipes", icon: <RecipeIcon /> },
        { label: "Artykuły", href: "/blog", icon: <BlogIcon /> },
        { label: "Ulubione", href: "/favorites", icon: <FavoriteIcon /> },
        { label: "O mnie", href: "/about", icon: <InfoIcon /> },
        {
            label: "Szukaj",
            icon: <SearchIcon />,
            onClick: () => setShowFilter(!showFilter),
        },
    ];

    const handleClose = () => setShowFilter(false);

    // ESC key to close
    useEffect(() => {
        if (showFilter) {
            const handleEsc = (e: KeyboardEvent) => {
                if (e.key === "Escape") handleClose();
            };
            document.addEventListener("keydown", handleEsc);
            return () => document.removeEventListener("keydown", handleEsc);
        }
    }, [showFilter]);

    return (
        <React.Fragment>
            <Menu navItems={navItems} />
            {showFilter && (
                <React.Fragment>
                    <Box
                        sx={{
                            position: "fixed",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            bgcolor: "rgba(0, 0, 0, 0.5)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            zIndex: 1300,
                        }}
                        onClick={handleClose} // Close on outside click
                    >
                        <Box
                            sx={{
                                bgcolor: "background.paper",
                                p: 3,
                                borderRadius: 1,
                                maxWidth: 400,
                                width: "90%",
                                maxHeight: "80%",
                                overflowY: "auto",
                                boxShadow: 24,
                            }}
                            onClick={e => e.stopPropagation()} // Prevent bubbling
                        >
                            <RecipeFilters
                                onFiltersChange={filters => {
                                    console.log("Applied filters:", filters); // Replace with logic (e.g., URL/context)
                                    // Optional: handleClose(); // Auto-close on apply if wanted
                                }}
                                onClose={handleClose} // Pass close handler
                            />
                        </Box>
                    </Box>
                </React.Fragment>
            )}
        </React.Fragment>
    );
};

export default Header;
