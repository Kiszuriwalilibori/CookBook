"use client";

import { useEffect } from "react";
import { Box, Button, Container, Typography } from "@mui/material";

type ErrorPageProps = {
    error: Error & { digest?: string };
    reset: () => void;
};

export default function ErrorPage({ error, reset }: ErrorPageProps) {
    useEffect(() => {
        console.error("Application route error:", {
            message: error.message,
            digest: error.digest,
            error,
        });
    }, [error]);

    return (
        <Container maxWidth="sm">
            <Box
                component="section"
                role="alert"
                sx={{
                    minHeight: "60vh",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    gap: 2,
                    py: 6,
                }}
            >
                <Typography component="h1" variant="h4">
                    Coś poszło nie tak
                </Typography>

                <Typography color="text.secondary">Wystąpił nieoczekiwany błąd podczas wyświetlania tej strony. Spróbuj ponownie.</Typography>

                {error.digest ? (
                    <Typography variant="body2" color="text.secondary">
                        Identyfikator błędu: {error.digest}
                    </Typography>
                ) : null}

                <Button variant="contained" onClick={reset}>
                    Spróbuj ponownie
                </Button>
            </Box>
        </Container>
    );
}
