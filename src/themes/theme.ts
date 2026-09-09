"use client";

import { createTheme, responsiveFontSizes } from "@mui/material/styles";
import { Roboto } from "next/font/google";
import { designSystem } from "./designSystem";

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

const customThemeValues = {
    menuColor: "#000000",
    focusColor: "#1976d2",
};
// #0d3a74 do rozważenia jako focusColor

const baseTheme = createTheme({
    palette: {
        primary: {
            main: designSystem.primary.main,
            light: "#C97B63",
            dark: "#8E3F29",
            contrastText: "#fff",
        },
        secondary: {
            main: "#677B67",
            light: "#859585",
            dark: "#485648",
        },
        background: {
            default: "#f5f5f5",
            paper: "#ffffff",
        },
        // ⬇️ Surface retained (do not remove)
        // surface: {
        //     main: "#F6723D",
        //     light: "#FF9F41",
        //     dark: "#F44F0C",
        // },
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
                    "--menu-color": customThemeValues.menuColor,
                    "--focus-color": customThemeValues.focusColor,
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
                arrow: {
                    color: "#A8BBA3",
                },
            },
        },
    },

    custom: customThemeValues,
});

const theme = responsiveFontSizes(createTheme(baseTheme));

export default theme;
