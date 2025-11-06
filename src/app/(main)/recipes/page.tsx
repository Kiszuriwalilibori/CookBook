import { Grid, Box, Typography, Alert } from "@mui/material";
import { getRecipesForCards } from "@/lib/getRecipesForCards";
import { Recipe } from "@/lib/types";
import { PageTitle } from "@/components";
import RecipeCard from "@/components/RecipeCard";
import { gridSize, pageContainerStyle } from "./styles";

export const revalidate = 3600;

export default async function RecipesPage() {
    try {
        const recipes: Recipe[] = await getRecipesForCards();

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
    } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : "Wystąpił nieznany błąd";

        return (
            <Box sx={pageContainerStyle} display="flex" flexDirection="column" alignItems="center" gap={2} p={4}>
                <Alert severity="error" sx={{ maxWidth: 600 }}>
                    Błąd: {errorMessage}
                </Alert>
            </Box>
        );
    }
}
