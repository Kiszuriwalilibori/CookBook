import { Inter } from "next/font/google";
import { Box } from "@mui/material";
import theme from "@/themes/theme";
import { Footer, Header } from "@/components";

import "./globals.css";
import { ThemeProvider } from "@mui/material";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { layoutContainerStyles, mainContentStyles } from "./layout.styles";
import { getRecipesSummary } from "@/lib/getRecipesSummary";

const inter = Inter({ subsets: ["latin"] });

export const viewport = {
    width: "device-width",
    initialScale: 1,
    themeColor: "#1976d2",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    const summary = await getRecipesSummary();

    return (
        <html lang="pl">
            <AppRouterCacheProvider>
                <ThemeProvider theme={theme}>
                    <body className={inter.className}>
                        <Box sx={layoutContainerStyles}>
                            <Header initialSummary={summary} fetchError={null} />
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

// import { Inter } from "next/font/google";
// import { Box, ThemeProvider } from "@mui/material";
// import theme from "@/themes/theme";
// import { Footer, Header } from "@/components";

// import "./globals.css";
// import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
// import { layoutContainerStyles, mainContentStyles } from "./layout.styles";
// import { getRecipesSummary } from "@/lib/getRecipesSummary";
// import type { Options } from "@/types";

// const inter = Inter({ subsets: ["latin"] });

// export const viewport = {
//     width: "device-width",
//     initialScale: 1,
//     themeColor: "#1976d2",
// };

// export default async function RootLayout({ children }: { children: React.ReactNode }) {
//     let summary: Options | null = null;
//     let fetchError: string | null = null;

//     try {
//         summary = await getRecipesSummary();
//     } catch (error) {
//         console.error("❌ Failed to prefetch recipes summary:", error);
//         fetchError = "Nie udało się pobrać podsumowania przepisów";
//         // fallback to empty structure
//         summary = {
//             titles: [],
//             cuisines: [],
//             tags: [],
//             dietaryRestrictions: [],
//             products: [],
//         };
//     }

//     return (
//         <html lang="pl">
//             <AppRouterCacheProvider>
//                 <ThemeProvider theme={theme}>
//                     <body className={inter.className}>
//                         <Box sx={layoutContainerStyles}>
//                             <Header initialSummary={summary} fetchError={fetchError} />
//                             <Box component="main" sx={mainContentStyles}>
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
