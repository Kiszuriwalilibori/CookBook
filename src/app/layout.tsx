import { Inter } from "next/font/google";
import { Box, ThemeProvider } from "@mui/material";
import theme from "@/themes/theme";
import { Footer, Header } from "@/components";
import { headers } from "next/headers";
import "./globals.css";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { layoutContainerStyles, mainContentStyles } from "./layout.styles";

import { fetchSummary } from "@/utils/fetchSummary";
import metadata from "../../public/metadata/metadata";
import { Pages } from "@/models/pages";

const inter = Inter({ subsets: ["latin"] });

export const viewport = {
    width: "device-width",
    initialScale: 1,
    themeColor: "#1976d2",
};

export async function generateMetadata() {
    const headerList = headers();
    const pathName = (await headerList).get("x-current-path") ?? "";
    const segments = pathName.split("/").filter(Boolean);
    const pageKey = (segments[0] ?? "home") as Pages;

    return metadata[pageKey] ?? metadata.home;
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    const { summary, error: fetchError } = await fetchSummary();

    return (
        <html lang="pl" suppressHydrationWarning={true}>
            <body className={inter.className}>
                <AppRouterCacheProvider>
                    <ThemeProvider theme={theme}>
                        <Box sx={layoutContainerStyles}>
                            <Header initialSummary={summary} fetchError={fetchError} />
                            <Box component="main" sx={mainContentStyles}>
                                {children}
                            </Box>
                            <Footer />
                        </Box>
                    </ThemeProvider>
                </AppRouterCacheProvider>
            </body>
        </html>
    );
}
// todo postarać się o google key
