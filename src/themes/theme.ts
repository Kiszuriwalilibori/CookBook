"use client";

import { createTheme, responsiveFontSizes } from "@mui/material/styles";
import { Roboto } from "next/font/google";
import { design } from "./design";

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
            focusColor: string;
        };
    }

    interface ThemeOptions {
        custom?: {
            menuColor?: string;
            focusColor?: string;
        };
    }
}

const roboto = Roboto({
    weight: ["300", "400", "500", "700"],
    subsets: ["latin"],
    display: "swap",
    fallback: ["Helvetica", "Arial", "sans-serif"],
});

// #0d3a74 do rozważenia jako focusColor

const baseTheme = createTheme({
    palette: {
        primary: {
            main: design.primary.main,
            light: design.primary.light,
            dark: design.primary.dark,
            contrastText: design.primary.contrastText,
        },
        secondary: {
            main: design.secondary.main,
            light: design.secondary.light,
            dark: design.secondary.dark,
        },
        background: {
            default: design.background.default,
            paper: design.background.paper,
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
        MuiButtonBase: {
            defaultProps: {
                disableRipple: true,
            },
        },
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
                    boxShadow: "0 4px 20px 0 shadows[1]",
                    transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
                    "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: "0 8px 25px 0 shadows[4])",
                    },
                },
            },
        },

        MuiCssBaseline: {
            styleOverrides: {
                ":root": {
                    "--menu-color": design.menuColor,
                    "--focus-color": design.focusColor,
                },
            },
        },

        MuiTextField: {
            defaultProps: {
                color: "primary",
                variant: "outlined",
            },
        },

        MuiOutlinedInput: {
            styleOverrides: {
                root: ({ theme }) => ({
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: theme.palette.primary.light,
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: theme.palette.divider,
                    },
                }),
            },
        },
        MuiInputLabel: {
            styleOverrides: {
                root: ({ theme }) => ({
                    "&.Mui-focused": {
                        color: theme.palette.text.primary,
                    },
                }),
            },
        },
        MuiTooltip: {
            styleOverrides: {
                tooltip: {
                    backgroundColor: "secondary.main",
                    color: "secondary.contrastText",
                    fontSize: "0.75rem",
                },
            },
        },
    },

    custom: { menuColor: design.menuColor, focusColor: design.focusColor },
});

const theme = responsiveFontSizes(createTheme(baseTheme));

export default theme;
