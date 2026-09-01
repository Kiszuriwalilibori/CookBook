"use client";

import { useEffect, useState } from "react";

import { useIsAdminLogged } from "@/stores/useAdminStore";

import { Box, Button, Paper } from "@mui/material";

import { focusableSx } from "@/styles/utilityStyles";

import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import { closeButtonSx, googleSignInPaperSx, googleSignInStatusSx, signinButtonWrapperStyles } from "./GoogleSignInButton.styles";

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
            <Paper elevation={0} sx={googleSignInPaperSx}>
                {loaded && (
                    <Box aria-live="polite" sx={googleSignInStatusSx}>
                        Opcja kontynuacji bez logowania jest dostępna
                    </Box>
                )}
                {/* {loaded && ( */}
                <Button aria-label="Kontynuuj bez logowania" fullWidth endIcon={<ArrowForwardIcon />} onClick={() => setVisible(false)} sx={{ ...closeButtonSx, ...focusableSx }}>
                    Kontynuuj bez logowania
                </Button>
                {/* Google button */}
                <div id="google-signin-button" aria-label="Zaloguj się przez Google" />
            </Paper>
        </Box>
    );
}
