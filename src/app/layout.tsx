import { Inter } from "next/font/google";
import { Box } from "@mui/material";
import theme from "@/themes/theme";
import { Footer, Header } from "@/components";

import "./globals.css";
import { ThemeProvider } from "@mui/material";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { layoutContainerStyles, mainContentStyles } from "./layout.styles";
import {getRecipesSummary} from "@/lib/getRecipesSummary";

const inter = Inter({ subsets: ["latin"] });

export const viewport = {
    width: "device-width",
    initialScale: 1,
    themeColor: "#1976d2",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    const { initialSummary, fetchError } = await getRecipesSummary();

    return (
        <html lang="pl">
            <AppRouterCacheProvider>
                <ThemeProvider theme={theme}>
                    <body className={inter.className}>
                        <Box sx={layoutContainerStyles}>
                            <Header initialSummary={initialSummary} fetchError={fetchError} />
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
