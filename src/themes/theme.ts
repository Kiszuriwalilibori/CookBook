"use client";

import { createTheme, responsiveFontSizes } from "@mui/material/styles";
import { Roboto } from "next/font/google";

// Extend Theme and ThemeOptions to include palette.surface and custom.menuColor
declare module "@mui/material/styles" {
    interface Palette {
        surface: {
            main: string;
            light: string;
            dark: string;
        };
    }
    interface PaletteOptions {
        surface?: {
            main?: string;
            light?: string;
            dark?: string;
        };
    }
    interface Theme {
        custom: {
            menuColor: string;
        };
    }
    interface ThemeOptions {
        custom?: {
            menuColor?: string;
        };
    }
}

const roboto = Roboto({
    weight: ["300", "400", "500", "700"],
    subsets: ["latin"],
    display: "swap",
    fallback: ["Helvetica", "Arial", "sans-serif"],
});

const baseTheme = createTheme({
    palette: {
        primary: {
            main: "#1976d2",
            light: "#42a5f5",
            dark: "#1565c0",
            contrastText: "#fff",
        },
        secondary: {
            main: "#9c27b0",
            light: "#ba68c8",
            dark: "#7b1fa2",
        },
        background: {
            default: "#f5f5f5",
            paper: "#ffffff",
        },
        surface: {
            main: "#F6723D",
            light: "#FF9F41",
            dark: "#F44F0C",
        },
    },
    typography: {
        fontFamily: roboto.style.fontFamily,
        h1: {
            fontSize: "2.5rem",
            fontWeight: 500,
        },
        h2: {
            fontSize: "2rem",
            fontWeight: 500,
        },
        h3: {
            fontSize: "1.75rem",
            fontWeight: 500,
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: "none" as const,
                    borderRadius: 8,
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    boxShadow: "0 4px 20px 0 rgba(0,0,0,0.05)",
                    transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
                    "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: "0 8px 25px 0 rgba(0,0,0,0.1)",
                    },
                },
            },
        },
        MuiCssBaseline: {
            styleOverrides: {
                ":root": {
                    "--menu-color": "#000000",
                },
            },
        },
    },
    custom: {
        menuColor: "#000000",
    },
});

const theme = responsiveFontSizes(createTheme(baseTheme));

export default theme;
