import { Inter } from "next/font/google";
import { Box, ThemeProvider } from "@mui/material";
import theme from "@/themes/theme";
import { Footer, Header, Providers } from "@/components";
import { headers } from "next/headers";
import "./globals.css";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { layoutContainerStyles, mainContentStyles } from "./layout.styles";

import { fetchSummary } from "@/utils/fetchSummary";
import metadata from "../../public/metadata/metadata";
import { Pages } from "@/models/pages";
import { BootstrapUser } from "./bootstrapUser";
import { getUserIdFromCookies } from "@/utils/server/getUserIdFromCookies";

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
    if (pageKey === "recipes" && segments.length > 1) {
        // nie generujemy dla recipes
        return {};
    }
    return metadata[pageKey] ?? metadata.home;
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    const { summary, error: fetchError } = await fetchSummary();
    const userId = await getUserIdFromCookies();

    return (
        <html lang="pl" suppressHydrationWarning={true}>
            <body className={inter.className}>
                <Providers>
                    <BootstrapUser />
                    <AppRouterCacheProvider>
                        <ThemeProvider theme={theme}>
                            <Box sx={layoutContainerStyles}>
                                <Header initialSummary={summary} fetchError={fetchError} />
                                {userId && <span>{userId}</span>}
                                <Box component="main" sx={mainContentStyles}>
                                    {children}
                                </Box>
                                <Footer />
                            </Box>
                        </ThemeProvider>
                    </AppRouterCacheProvider>
                </Providers>
            </body>
        </html>
    );
}
// todo postarać się o google key
