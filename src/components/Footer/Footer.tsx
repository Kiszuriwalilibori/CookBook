
"use client";

import React from "react";
import { Box, Container, Typography, Link as MuiLink } from "@mui/material";
import Link from "next/link";
import { footerContainer, footerContent, linkContainer, linkStyle } from "./Footer.styles";

const Footer = () => {
    return (
        <Box component="footer" sx={footerContainer}>
            <Container maxWidth="lg">
                <Box sx={footerContent}>
                    <Typography variant="body2" color="text.secondary">
                        © {new Date().getFullYear()} CookBook. All rights reserved.
                    </Typography>

                    <Box sx={linkContainer}>
                        <MuiLink component={Link} href="/privacy" color="text.secondary" variant="body2" sx={linkStyle}>
                            Privacy Policy
                        </MuiLink>
                        <MuiLink component={Link} href="/terms" color="text.secondary" variant="body2" sx={linkStyle}>
                            Terms of Service
                        </MuiLink>
                        <MuiLink component={Link} href="/contact" color="text.secondary" variant="body2" sx={linkStyle}>
                            Contact Us
                        </MuiLink>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
};

export default Footer;
