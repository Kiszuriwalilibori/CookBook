// src/components/GoogleSignInButton.tsx
"use client";

import { Box } from "@mui/material";
import { useAdminStore } from "@/stores";
import { useGoogleSignIn } from "@/hooks";
import { googleButtonOverlay, googleButtonWrapper } from "./Header.styles";

export const GoogleSignInButton = () => {
    const isAdminLogged = useAdminStore(s => s.isAdminLogged);

    useGoogleSignIn();

    if (isAdminLogged) return null;

    return (
        <Box sx={googleButtonOverlay}>
            <Box sx={googleButtonWrapper}>
                <div id="google-signin-button" />
            </Box>
        </Box>
    );
};

export default GoogleSignInButton;
