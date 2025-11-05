// import { Inter } from "next/font/google";
// import { Box } from "@mui/material";
// import theme from "@/themes/theme";
// import { Footer, Header } from "@/components";

// import "./globals.css";
// import { ThemeProvider } from "@mui/material";
// import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";

// const inter = Inter({ subsets: ["latin"] });

// export const viewport = {
//     width: "device-width",
//     initialScale: 1,
//     themeColor: "#1976d2",
// };

// export default function RootLayout({ children }: { children: React.ReactNode }) {
//     return (
//         <html lang="pl">
//             <AppRouterCacheProvider>
//                 <ThemeProvider theme={theme}>
//                     <body className={inter.className}>
//                         <Box
//                             sx={{
//                                 display: "flex",
//                                 flexDirection: "column",
//                                 minHeight: "100vh",
//                             }}
//                         >
//                             <Header />
//                             <Box component="main" sx={{ flexGrow: 1 }}>
//                                 {children}
//                             </Box>
//                             <Footer />
//                         </Box>
//                     </body>
//                 </ThemeProvider>
//             </AppRouterCacheProvider>
//         </html>
//     );
// }
import { Inter } from "next/font/google";
import { Box } from "@mui/material";
import theme from "@/themes/theme";
import { Footer, Header } from "@/components";

import "./globals.css";
import { ThemeProvider } from "@mui/material";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { Options } from "@/types";

const inter = Inter({ subsets: ["latin"] });

export const viewport = {
    width: "device-width",
    initialScale: 1,
    themeColor: "#1976d2",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    let initialSummary: Options | null = null;
    let fetchError: string | null = null;

    try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
        const res = await fetch(`${baseUrl}/api/recipes-summary`, {
            cache: "force-cache",
            next: { revalidate: 3600 },
        });
        if (!res.ok) throw new Error(`API error: ${res.status}`);
        initialSummary = await res.json();
    } catch (error) {
        console.error("Failed to prefetch recipes summary:", error);
        fetchError = error instanceof Error ? error.message : "Prefetch failed";
        initialSummary = { titles: [], cuisines: [], tags: [], dietaryRestrictions: [], products: [] };
    }

    return (
        <html lang="pl">
            <AppRouterCacheProvider>
                <ThemeProvider theme={theme}>
                    <body className={inter.className}>
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                minHeight: "100vh",
                            }}
                        >
                            <Header initialSummary={initialSummary} fetchError={fetchError} />
                            <Box component="main" sx={{ flexGrow: 1 }}>
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
