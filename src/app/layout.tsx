import { Inter } from "next/font/google";
import { Box, ThemeProvider } from "@mui/material";
import theme from "@/themes/theme";
import { Footer, Header } from "@/components";

import "./globals.css";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { layoutContainerStyles, mainContentStyles } from "./layout.styles";
import { fetchRecipesSummarySafe } from "@/lib/fetchRecipesSummarySafe";

const inter = Inter({ subsets: ["latin"] });

export const viewport = {
    width: "device-width",
    initialScale: 1,
    themeColor: "#1976d2",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    const { summary, error: fetchError } = await fetchRecipesSummarySafe();

    return (
        <html lang="pl">
            <AppRouterCacheProvider>
                <ThemeProvider theme={theme}>
                    <body className={inter.className}>
                        <Box sx={layoutContainerStyles}>
                            <Header initialSummary={summary} fetchError={fetchError} />
                            <Box component="main" sx={mainContentStyles}>
                                {children}
                            </Box>
                            <Footer />
                        </Box>
                    </body>
                </ThemeProvider>
            </AppRouterCacheProvider>
        </html>
    );
}
