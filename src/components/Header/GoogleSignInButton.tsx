"use client";

import { useEffect, useState } from "react";
import { useAdminStore } from "@/stores/useAdminStore";
import { IconButton, Box } from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { closeButtonStyles, signinButtonWrapperStyles } from "./Header.styles";

export default function GoogleSignInButton() {
    const isAdminLogged = useAdminStore(s => s.isAdminLogged);
    const [visible, setVisible] = useState(true);
    const [loaded, setLoaded] = useState(false); // Nowy state – czeka na załadowanie przycisku Google

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
        }, 10000); // Znika po 10 sekundach

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        // Czekaj na załadowanie Google i render przycisku
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
        <Box sx={signinButtonWrapperStyles}>
            <Box sx={{ position: "relative" }}>
                <div id="google-signin-button" />
                {loaded && ( // Pokazuje close TYLKO gdy przycisk Google jest załadowany
                    <IconButton sx={closeButtonStyles} onClick={() => setVisible(false)}>
                        <CloseIcon style={{ color: "red" }} />
                    </IconButton>
                )}
            </Box>
        </Box>
    );
}
