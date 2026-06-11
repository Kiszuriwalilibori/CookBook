"use client";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

import { useTheme } from "@mui/material/styles";

type LoadingIndicatorProps = {
    open?: boolean;
    prompt?: string;
    size?: number;
    centeredInParent?: boolean;
};

export default function LoadingIndicator({ open = true, prompt = "Ładowanie...", size = 120, centeredInParent = false }: LoadingIndicatorProps) {
    const theme = useTheme();
    return (
        <Backdrop
            open={open}
            sx={{
                position: centeredInParent ? "absolute" : "fixed",
                inset: 0,
                zIndex: theme.zIndex.modal + 999,
                backgroundColor: "transparent",
            }}
        >
            <Box
                sx={{
                    position: "relative",
                    width: size,
                    height: size,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                {/* Kolorowy spinner */}
                <CircularProgress
                    size={size}
                    thickness={3}
                    sx={{
                        position: "absolute",
                        color: "transparent",
                        animationDuration: "1.4s",
                        "& .MuiCircularProgress-circle": {
                            strokeLinecap: "round",
                            stroke: "url(#mui-spinner-gradient)",
                        },
                    }}
                />

                {/* Szkliste wnętrze */}
                <Paper
                    elevation={0}
                    sx={{
                        width: size * 0.82,
                        height: size * 0.82,
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        textAlign: "center",
                        px: 2,
                        background: "rgba(255,255,255,0.12)",
                        border: "1px solid rgba(255,255,255,0.2)",
                        backdropFilter: "blur(14px)",
                        WebkitBackdropFilter: "blur(14px)",
                        boxShadow: `
              inset 0 1px 1px rgba(255,255,255,0.22),
              0 8px 24px rgba(0,0,0,0.18)
            `,
                    }}
                >
                    <Typography
                        variant="caption"
                        sx={{
                            color: "#111",
                            fontWeight: 600,
                            lineHeight: 1.3,
                            letterSpacing: 0.3,
                            textShadow: "0 1px 1px rgba(255,255,255,0.35)",
                        }}
                    >
                        {prompt}
                    </Typography>
                </Paper>

                {/* SVG gradient */}
                <svg width="0" height="0">
                    <defs>
                        <linearGradient id="mui-spinner-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#00E5FF" />
                            <stop offset="25%" stopColor="#7C4DFF" />
                            <stop offset="50%" stopColor="#FF4081" />
                            <stop offset="75%" stopColor="#FF9100" />
                            <stop offset="100%" stopColor="#00E676" />
                        </linearGradient>
                    </defs>
                </svg>
            </Box>
        </Backdrop>
    );
}

/* =========================
   PRZYKŁAD UŻYCIA
========================= */

/*
<LoadingIndicator
  open={loading}
  prompt="Generowanie odpowiedzi"
/>
*/
