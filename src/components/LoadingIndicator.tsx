// //todo przemyśleć czy jednak nie dać fixed pozycji po całości

"use client";

import Portal from "@mui/material/Portal";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import useReducedMotion from "@/hooks/useReducedMotion";
import { design } from "@/themes/design";

type LoadingIndicatorProps = {
    open?: boolean;
    prompt?: string;
    size?: number;
    centeredInParent?: boolean;
    overlayInParent?: boolean;
};

export default function LoadingIndicator({ open = true, prompt = "Ładowanie...", size = 120, centeredInParent = false, overlayInParent = false }: LoadingIndicatorProps) {
    const { radius, loading } = design;
    const theme = useTheme();
    const prefersReducedMotion = useReducedMotion();

    const content = (
        <Box
            role="status"
            aria-live="polite"
            aria-busy={open}
            aria-label={prompt}
            sx={{
                position: "relative",
                width: size,
                height: size,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            {/* Kolorowy spinner – dekoracyjny */}
            <CircularProgress
                size={size}
                thickness={3}
                aria-hidden="true"
                sx={{
                    position: "absolute",
                    color: "transparent",
                    animationDuration: "1.4s",
                    ...(prefersReducedMotion && {
                        animation: "none",
                    }),
                    "& .MuiCircularProgress-circle": {
                        strokeLinecap: "round",
                        stroke: "url(#mui-spinner-gradient)",
                        ...(prefersReducedMotion && {
                            animation: "none",
                        }),
                    },
                }}
            />

            {/* Szkliste wnętrze */}
            <Paper
                elevation={0}
                aria-hidden="true"
                sx={{
                    width: size * 0.82,
                    height: size * 0.82,
                    borderRadius: radius.circle,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    px: 2,
                    background: design.loading.glass.background,
                    border: `1px solid ${loading.glass.border}`,
                    backdropFilter: "blur(14px)",
                    WebkitBackdropFilter: "blur(14px)",
                    boxShadow: `
                        inset 0 1px 1px ${loading.glass.highlight},
                        0 8px 24px ${loading.glass.shadow}
                    `,
                }}
            >
                <Typography
                    variant="caption"
                    sx={{
                        color: design.loading.text,
                        fontWeight: 600,
                        lineHeight: 1.3,
                        letterSpacing: 0.3,
                        textShadow: `0 1px 1px ${loading.glass.textShadow}`,
                    }}
                >
                    {prompt}
                </Typography>
            </Paper>

            {/* SVG gradient */}
            <svg width="0" height="0" aria-hidden="true" focusable="false">
                <defs>
                    <linearGradient id="mui-spinner-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor={loading.gradient.cyan} />
                        <stop offset="25%" stopColor={loading.gradient.violet} />
                        <stop offset="50%" stopColor={loading.gradient.pink} />
                        <stop offset="75%" stopColor={loading.gradient.orange} />
                        <stop offset="100%" stopColor={loading.gradient.green} />
                    </linearGradient>
                </defs>
            </svg>
        </Box>
    );

    if (overlayInParent) {
        return (
            <Box
                sx={{
                    position: "absolute",
                    inset: 0,
                    zIndex: theme.zIndex.modal + 999,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "transparent",
                    pointerEvents: "none",
                }}
            >
                {content}
            </Box>
        );
    }

    if (centeredInParent) {
        return (
            <Backdrop
                open={open}
                sx={{
                    position: "absolute",
                    inset: 0,
                    zIndex: theme.zIndex.modal + 999,
                    backgroundColor: "transparent",
                }}
                tabIndex={-1}
            >
                {content}
            </Backdrop>
        );
    }

    return (
        <Portal>
            <Backdrop
                open={open}
                sx={{
                    position: "fixed",
                    inset: 0,
                    zIndex: theme.zIndex.modal + 999,
                    backgroundColor: "transparent",
                }}
                tabIndex={-1}
            >
                {content}
            </Backdrop>
        </Portal>
    );
}

//todo przemyśleć czy jednak nie dać fixed pozycji po całości
