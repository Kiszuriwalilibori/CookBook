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
                    <Typography variant="body2" color="common.black">
                        © {new Date().getFullYear()} CookBook. All rights reserved.
                    </Typography>

                    <Box sx={linkContainer}>
                        <MuiLink component={Link} href="/privacy" color="common.black" variant="body2" sx={linkStyle}>
                            Privacy Policy
                        </MuiLink>
                        <MuiLink component={Link} href="/terms" color="common.black" variant="body2" sx={linkStyle}>
                            Terms of Service
                        </MuiLink>
                        <MuiLink component={Link} href="/contact" color="common.black" variant="body2" sx={linkStyle}>
                            Contact Us
                        </MuiLink>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
};

export default Footer;
