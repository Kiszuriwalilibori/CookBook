"use client";

import { useEffect, useState } from "react";
import { useIsAdminLogged } from "@/stores/useAdminStore";
import { Box, Button, Paper } from "@mui/material";
import { closeButtonSx, signinButtonWrapperStyles } from "./Header.styles";
import { focusableSx } from "@/styles/utilityStyles";

export default function GoogleSignInButton() {
    const isAdminLogged = useIsAdminLogged();
    const [visible, setVisible] = useState(true);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
        }, 100000000);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (window.googleInitialized) {
            setLoaded(true);
        } else {
            const interval = setInterval(() => {
                if (window.googleInitialized) {
                    setLoaded(true);
                    clearInterval(interval);
                }
            }, 100);

            return () => clearInterval(interval);
        }
    }, []);

    if (isAdminLogged || !visible) return null;

    return (
        <Box sx={signinButtonWrapperStyles} role="group" aria-label="Logowanie" aria-live="polite">
            <Paper
                elevation={0}
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 1,
                    backgroundColor: "transparent",
                }}
            >
                {loaded && (
                    <Box aria-live="polite" sx={{ position: "absolute", left: -9999 }}>
                        Opcja kontynuacji bez logowania jest dostępna
                    </Box>
                )}
                {/* Google button */}
                <div id="google-signin-button" aria-label="Zaloguj się przez Google" />

                {/* {loaded && ( */}
                <Button aria-label="Kontynuuj bez logowania i pomiń logowanie konta" fullWidth onClick={() => setVisible(false)} sx={{ ...closeButtonSx, ...focusableSx }}>
                    Kontynuuj bez logowania
                </Button>
                {/* )} */}
            </Paper>
        </Box>
    );
}
