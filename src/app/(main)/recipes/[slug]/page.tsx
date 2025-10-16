//

// app/recipes/[slug]/page.tsx
import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react"; // For rich text rendering
import type { PortableTextComponents } from "@portabletext/react"; // Import for typing
import { getRecipeBySlug } from "@/lib/sanity";
import { Recipe } from "@/lib/types";
import Image from "next/image"; // For optimized images
import { Box, Typography, List, ListItem, ListItemText, Grid } from "@mui/material";
import { styles } from "./styles";

// Custom PortableText components (typed correctly for compatibility)
const PortableTextComponents: Partial<PortableTextComponents> = {
    block: ({ children }) => (
        <Typography variant="body1" sx={{ mb: 2 }}>
            {children}
        </Typography>
    ),
    list: ({ children }) => <List sx={{ ml: 3, mb: 2, listStyleType: "disc" }}>{children}</List>,
    listItem: ({ children }) => (
        <ListItem sx={{ px: 0, py: 0.5 }}>
            <ListItemText primary={children} />
        </ListItem>
    ),
    marks: {
        strong: ({ children }) => (
            <Typography component="strong" sx={{ fontWeight: "bold" }}>
                {children}
            </Typography>
        ),
        em: ({ children }) => (
            <Typography component="em" sx={{ fontStyle: "italic" }}>
                {children}
            </Typography>
        ),
        link: ({ children, value }) => (
            <Typography component="a" href={value?.href || "#"} target="_blank" rel="noopener noreferrer" sx={{ color: "primary.main", textDecoration: "underline", "&:hover": { textDecoration: "none" } }}>
                {children}
            </Typography>
        ),
    },
};

interface Params {
    slug: string;
}

export default async function RecipePage({ params }: { params: Promise<Params> }) {
    const { slug } = await params;
    const recipe: Recipe | null = await getRecipeBySlug(slug);

    if (!recipe) {
        notFound(); // 404 if no recipe
    }

    return (
        <Box sx={styles.root}>
            {/* Hero Image & Title */}
            {recipe.description?.image?.asset?.url && (
                <Box sx={styles.heroImageContainer}>
                    <Image
                        src={recipe.description.image.asset.url!}
                        alt={recipe.description.image.alt || recipe.title}
                        fill
                        style={{ objectFit: "cover" }}
                        priority // Optional: Prioritize for hero image
                        sizes="(max-width: 768px) 100vw, 50vw" // Responsive sizes for optimization
                    />
                </Box>
            )}
            <Typography variant="h1" sx={styles.mainTitle}>
                {recipe.title}
            </Typography>

            {/* Description */}
            {recipe.description && (
                <Box sx={styles.descriptionContainer}>
                    {recipe.description.title && (
                        <Typography variant="h2" sx={styles.descriptionTitle}>
                            {recipe.description.title}
                        </Typography>
                    )}
                    {recipe.description.notes && (
                        <Typography variant="body2" sx={styles.descriptionNotes}>
                            {recipe.description.notes}
                        </Typography>
                    )}
                    {recipe.description.content && <PortableText value={recipe.description.content} components={PortableTextComponents} />}
                </Box>
            )}

            {/* Metadata: Time, Servings, Difficulty */}
            <Box sx={styles.metadata}>
                <Typography component="span">⏱️ {recipe.preparationTime} min prep</Typography>
                <Typography component="span">🍽️ {recipe.servings} servings</Typography>
                <Typography component="span">⭐ {recipe.difficulty}</Typography>
                {recipe.cuisine && <Typography component="span">🌍 {recipe.cuisine}</Typography>}
            </Box>

            {/* Ingredients */}
            {recipe.ingredients && recipe.ingredients.length > 0 && (
                <Box sx={styles.ingredientsContainer}>
                    <Typography variant="h2" sx={styles.ingredientsTitle}>
                        Składniki
                    </Typography>
                    <List sx={styles.ingredientsList}>
                        {recipe.ingredients.map((ing, i) => (
                            <ListItem key={i} sx={styles.ingredientsListItem}>
                                <Typography variant="body2">
                                    {ing.quantity} {ing.name}
                                </Typography>
                            </ListItem>
                        ))}
                    </List>
                </Box>
            )}

            {/* Preparation Steps */}
            {recipe.preparationSteps && recipe.preparationSteps.length > 0 && (
                <Box sx={styles.preparationContainer}>
                    <Typography variant="h2" sx={styles.preparationTitle}>
                        Przygotowanie
                    </Typography>
                    {recipe.preparationSteps.map((step, i) => (
                        <Box key={step._key || i} sx={styles.stepContainer}>
                            <Typography variant="h3" sx={styles.stepTitle}>
                                Krok {i + 1}
                            </Typography>
                            {step.image?.asset?.url && (
                                <Box sx={styles.stepImageContainer}>
                                    <Image src={step.image.asset.url!} alt={step.image.alt || `Step ${i + 1}`} fill style={{ objectFit: "cover" }} sizes="(max-width: 768px) 100vw, 50vw" />
                                </Box>
                            )}
                            {step.content && <PortableText value={step.content} components={PortableTextComponents} />}
                            {step.notes && (
                                <Typography variant="body2" sx={styles.stepNotes}>
                                    {step.notes}
                                </Typography>
                            )}
                        </Box>
                    ))}
                </Box>
            )}

            {/* Additional Info */}
            <Grid container spacing={2} sx={styles.additionalInfoGrid}>
                {recipe.calories && (
                    <Grid size={{ xs: 12, sm: 6 }} sx={styles.additionalInfoItem}>
                        <Typography>Calories: {recipe.calories}</Typography>
                    </Grid>
                )}
                {recipe.cookingTime && (
                    <Grid size={{ xs: 12, sm: 6 }} sx={styles.additionalInfoItem}>
                        <Typography>Cooking Time: {recipe.cookingTime} min</Typography>
                    </Grid>
                )}
                {recipe.dietaryRestrictions && recipe.dietaryRestrictions.length > 0 && (
                    <Grid size={{ xs: 12, sm: 6 }} sx={styles.additionalInfoItem}>
                        <Typography>Dietary: {recipe.dietaryRestrictions.join(", ")}</Typography>
                    </Grid>
                )}
                {recipe.tags && recipe.tags.length > 0 && (
                    <Grid size={{ xs: 12, sm: 6 }} sx={styles.additionalInfoItem}>
                        <Typography>Tags: {recipe.tags.join(", ")}</Typography>
                    </Grid>
                )}
            </Grid>

            {/* Source */}
            {recipe.source && (
                <Box sx={styles.sourceContainer}>
                    <Typography variant="body2" sx={styles.sourceText}>
                        Source: {recipe.source.title || (recipe.source.isInternet ? recipe.source.http : recipe.source.book)}
                    </Typography>
                </Box>
            )}
        </Box>
    );
}
