import Link from "next/link";
import { Box, Button, Container, Typography } from "@mui/material";

export default function NotFound() {
    return (
        <Container maxWidth="sm">
            <Box
                component="section"
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
                <Typography component="p" variant="h2" color="primary" aria-label="Błąd 404">
                    404
                </Typography>

                <Typography component="h1" variant="h4">
                    Nie znaleziono strony
                </Typography>

                <Typography color="text.secondary">Ten adres jest nieprawidłowy albo strona została przeniesiona.</Typography>

                <Button component={Link} href="/" variant="contained">
                    Wróć na stronę główną
                </Button>
            </Box>
        </Container>
    );
}
