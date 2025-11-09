// "use client";

// import { useEffect } from "react";
// import { Grid, Box, Typography, Alert } from "@mui/material";
// import { PageTitle } from "@/components";
// import RecipeCard from "@/components/RecipeCard";
// import { gridSize, pageContainerStyle } from "./styles";
// import { useRecipesStore } from "@/stores/useRecipesStore";
// import { type Recipe } from "@/lib/types";

// export default function RecipesClient({ initialRecipes }: { initialRecipes: Recipe[] }) {
//     const { recipes, setRecipes, loading, error } = useRecipesStore();

//     // hydrate store with SSR data
//     useEffect(() => {
//         setRecipes(initialRecipes);
//     }, [initialRecipes, setRecipes]);

//     if (loading) {
//         return (
//             <Box sx={pageContainerStyle}>
//                 <Typography textAlign="center" mt={4}>
//                     Ładowanie…
//                 </Typography>
//             </Box>
//         );
//     }

//     if (error) {
//         return (
//             <Box sx={pageContainerStyle}>
//                 <Alert severity="error" sx={{ maxWidth: 600 }}>
//                     {error}
//                 </Alert>
//             </Box>
//         );
//     }

//     if (!recipes || recipes.length === 0) {
//         return (
//             <Box sx={pageContainerStyle}>
//                 <PageTitle title="Przepisy" />
//                 <Typography variant="h6" textAlign="center" mt={4}>
//                     Brak przepisów do wyświetlenia.
//                 </Typography>
//             </Box>
//         );
//     }

//     return (
//         <Box sx={pageContainerStyle}>
//             <PageTitle title="Przepisy" />
//             <Grid container spacing={3} justifyContent="center">
//                 {recipes.map(recipe => (
//                     <Grid size={gridSize} key={recipe._id}>
//                         <RecipeCard recipe={recipe} />
//                     </Grid>
//                 ))}
//             </Grid>
//         </Box>
//     );
// }
"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Grid, Box, Typography, Alert } from "@mui/material";
import { PageTitle } from "@/components";
import RecipeCard from "@/components/RecipeCard";
import { gridSize, pageContainerStyle } from "./styles";
import { useRecipesStore } from "@/stores/useRecipesStore";
import { type FilterState } from "@/types";
import { type Recipe } from "@/lib/types";

export default function RecipesClient({ initialRecipes }: { initialRecipes: Recipe[] }) {
    const searchParams = useSearchParams();
    const { recipes, setRecipes, loading, error, fetchFilteredRecipes } = useRecipesStore(); // Assume fetchFilteredRecipes is in store

    // hydrate store with SSR data
    useEffect(() => {
        setRecipes(initialRecipes);
    }, [initialRecipes, setRecipes]);

    // Client-side sync: Re-fetch if URL params change (e.g., back/forward, direct link)
    useEffect(() => {
        // Parse searchParams into filters (mirror server/API logic)
        const filters: Partial<FilterState> = {
            title: searchParams.get("title") || undefined,
            cuisine: searchParams.get("cuisine") || undefined,
            tag: searchParams.getAll("tag"),
            dietary: searchParams.getAll("dietary"),
            product: searchParams.getAll("product"),
        };

        // If params present, refetch to update store (SSR already handled initial)
        if (Object.values(filters).some(v => v && (Array.isArray(v) ? v.length > 0 : v !== ""))) {
            fetchFilteredRecipes(filters);
        }
    }, [searchParams, fetchFilteredRecipes]);

    if (loading) {
        return (
            <Box sx={pageContainerStyle}>
                <Typography textAlign="center" mt={4}>
                    Ładowanie…
                </Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={pageContainerStyle}>
                <Alert severity="error" sx={{ maxWidth: 600 }}>
                    {error}
                </Alert>
            </Box>
        );
    }

    if (!recipes || recipes.length === 0) {
        return (
            <Box sx={pageContainerStyle}>
                <PageTitle title="Przepisy" />
                <Typography variant="h6" textAlign="center" mt={4}>
                    Brak przepisów do wyświetlenia.
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={pageContainerStyle}>
            <PageTitle title="Przepisy" />
            <Grid container spacing={3} justifyContent="center">
                {recipes.map(recipe => (
                    <Grid size={gridSize} key={recipe._id}>
                        <RecipeCard recipe={recipe} />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}
