// app/recipes/[slug]/page.tsx
import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react"; // For rich text rendering
import type { PortableTextComponents } from "@portabletext/react"; // Import for typing
import { getRecipeBySlug } from "@/lib/sanity";
import { Recipe } from "@/lib/types";
import Image from "next/image"; // For optimized images
import { Box, Typography, List, ListItem, ListItemText, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { styles, FONT_SIZE, portableTextSx } from "./styles";
import { Separator } from "@/components";
import { fieldTranslations } from "@/lib/types";

// Custom PortableText components (typed correctly for compatibility)
const PortableTextComponents: Partial<PortableTextComponents> = {
    block: ({ children }) => (
        <Typography variant="body1" sx={portableTextSx.block}>
            {children}
        </Typography>
    ),
    list: ({ children }) => <List sx={portableTextSx.list}>{children}</List>,
    listItem: ({ children }) => (
        <ListItem sx={portableTextSx.listItem}>
            <ListItemText primary={children} />
        </ListItem>
    ),
    marks: {
        strong: ({ children }) => (
            <Typography component="strong" sx={portableTextSx.strong}>
                {children}
            </Typography>
        ),
        em: ({ children }) => (
            <Typography component="em" sx={portableTextSx.em}>
                {children}
            </Typography>
        ),
        link: ({ children, value }) => (
            <Typography component="a" href={value?.href || "#"} target="_blank" rel="noopener noreferrer" sx={portableTextSx.link}>
                {children}
            </Typography>
        ),
    },
};

interface Params {
    slug: string;
}

// Funkcja do pobierania tłumaczenia etykiety
const getLabel = (field: string): string => fieldTranslations[field] || field;

export default async function RecipePage({ params }: { params: Promise<Params> }) {
    const { slug } = await params;
    const recipe: Recipe | null = await getRecipeBySlug(slug);

    if (!recipe) {
        notFound(); // 404 if no recipe
    }

    const isAdmin = false;

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
            <Separator />

            {/* Combined Metadata */}
            <Box sx={styles.metadata}>
                <Typography component="span">⏱️ {recipe.preparationTime} min przygotowanie</Typography>
                <Typography component="span">🍽️ {recipe.servings} porcji</Typography>
                <Typography component="span">⭐ {recipe.difficulty}</Typography>
                {recipe.cuisine && <Typography component="span">🌍 {recipe.cuisine}</Typography>}
                {recipe.calories && (
                    <Typography component="span">
                        {getLabel("calories")}: {recipe.calories}
                    </Typography>
                )}
                {recipe.cookingTime && (
                    <Typography component="span">
                        {getLabel("cookingTime")}: {recipe.cookingTime} min
                    </Typography>
                )}
                {recipe.dietaryRestrictions && recipe.dietaryRestrictions.length > 0 && (
                    <Typography component="span">
                        {getLabel("dietaryRestrictions")}: {recipe.dietaryRestrictions.join(", ")}
                    </Typography>
                )}
                {recipe.tags && recipe.tags.length > 0 && (
                    <Typography component="span">
                        {getLabel("tags")}: {recipe.tags.join(", ")}
                    </Typography>
                )}
            </Box>

            {/* Description */}
            {recipe.description && (
                <Box sx={styles.descriptionContainer}>
                    <Separator />
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

            <Separator />

            {/* Ingredients */}
            {recipe.ingredients && recipe.ingredients.length > 0 && (
                <Box sx={styles.ingredientsContainer}>
                    <Typography variant="h2" sx={styles.ingredientsTitle}>
                        Składniki
                    </Typography>
                    <List sx={styles.ingredientsList}>
                        {recipe.ingredients.map((ing, i) => (
                            <ListItem key={i} sx={styles.ingredientsListItem}>
                                <Typography variant="body2" sx={{ fontSize: FONT_SIZE }}>
                                    {ing.quantity} {ing.name}
                                </Typography>
                            </ListItem>
                        ))}
                    </List>
                </Box>
            )}

            {/* Preparation Steps - Each step in its own Accordion, initially expanded, icon on left */}
            {recipe.preparationSteps && recipe.preparationSteps.length > 0 && (
                <Box sx={styles.preparationContainer}>
                    <Typography variant="h2" sx={styles.preparationTitle}>
                        Przygotowanie
                    </Typography>
                    {recipe.preparationSteps.map((step, i) => (
                        <Accordion
                            key={step._key || i}
                            defaultExpanded={true} // Initially expanded
                            sx={{
                                boxShadow: 0, // No shadow/borders to blend with surface
                                border: "none", // No border
                                "&:before": { display: "none" }, // Remove default divider
                                "& .MuiAccordionSummary-root": { px: 0, minHeight: "auto" }, // Custom summary
                                "&.Mui-expanded": {
                                    margin: 0,
                                },
                            }}
                        >
                            <AccordionSummary
                                expandIcon={null} // Hide default icon
                                sx={{
                                    justifyContent: "flex-start", // Start from left for alignment
                                    alignItems: "center", // Vertical alignment with number
                                    px: 0,
                                    minHeight: "auto",
                                    py: 0.25, // Reduced from 0.5 to quarter for even tighter vertical spacing
                                    "& .MuiAccordionSummary-content": { ml: 0 }, // No margin for tight alignment
                                    "& .MuiAccordionSummary-content.Mui-expanded": {
                                        margin: "8px 0",
                                    },
                                }}
                            >
                                <Typography variant="h3" sx={{ fontWeight: "600", fontSize: { xs: "18px", sm: "19px", md: "20px" }, mb: 0, lineHeight: 1 }}>
                                    {i + 1}
                                </Typography>
                                <ExpandMoreIcon sx={{ color: "grey.800", ml: 1, transform: "translateY(0px)" }} />
                            </AccordionSummary>
                            <AccordionDetails sx={{ p: 0, mt: -0.5 }}>
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
                            </AccordionDetails>
                        </Accordion>
                    ))}
                </Box>
            )}

            {/* Source */}
            {isAdmin && recipe.source && (
                <Box sx={styles.sourceContainer}>
                    <Typography variant="body2" sx={styles.sourceText}>
                        Źródło: {recipe.source.title || (recipe.source.isInternet ? recipe.source.http : recipe.source.book)}
                    </Typography>
                </Box>
            )}
        </Box>
    );
}
