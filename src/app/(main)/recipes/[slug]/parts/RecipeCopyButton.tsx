// "use client";

// import { Button } from "@mui/material";
// import { Recipe } from "@/lib/types";
// import { styles } from "../styles";

// interface RecipeCopyButtonProps {
//     recipe: Recipe;
// }

// export function RecipeCopyButton({ recipe }: RecipeCopyButtonProps) {
//     const generateCopyableText = (): string => {
//         let text = "Składniki:\n";
//         if (recipe.ingredients && recipe.ingredients.length > 0) {
//             recipe.ingredients.forEach(ing => {
//                 text += `- ${ing.quantity} ${ing.name}\n`;
//             });
//         }
//         text += "\nPrzygotowanie:\n";
//         if (recipe.preparationSteps && recipe.preparationSteps.length > 0) {
//             recipe.preparationSteps.forEach((step, i) => {
//                 text += `${i + 1}. `;
//                 if (step.content) {
//                     // Simple extraction of text from PortableText; for full rich text, use a serializer
//                     step.content.forEach(block => {
//                         if (block.children) {
//                             block.children.forEach(child => {
//                                 if (child.text) {
//                                     text += child.text + " ";
//                                 }
//                             });
//                         }
//                     });
//                 }
//                 if (step.notes) {
//                     text += `(${step.notes})`;
//                 }
//                 text += "\n";
//             });
//         }
//         return text;
//     };

//     const handleCopy = async () => {
//         const text = generateCopyableText();
//         await navigator.clipboard.writeText(text);
//         // Optional: Add snackbar/toast for feedback
//         alert("Skopiowano składniki i kroki przygotowania do schowka!");
//     };

//     return (
//         <Button variant="outlined" onClick={handleCopy} sx={styles.copyButton}>
//             Kopiuj składniki i przygotowanie do dokumentu
//         </Button>
//     );
// }
// app/recipes/[slug]/parts/RecipeCopyButton.tsx (updated: add title and URL to copied text; configurable base URL)
// "use client";

// import { Button } from "@mui/material";
// import { Recipe } from "@/lib/types";
// import { styles } from "../styles";

// interface RecipeCopyButtonProps {
//     recipe: Recipe;
//     slug: string;
// }

// export function RecipeCopyButton({ recipe, slug }: RecipeCopyButtonProps) {
//     // Configurable base URL - update NEXT_PUBLIC_BASE_URL in .env.local after publishing to Vercel
//     const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

//     const generateCopyableText = (): string => {
//         let text = `${recipe.title}\n\n`; // Add recipe title at top
//         text += "Składniki:\n";
//         if (recipe.ingredients && recipe.ingredients.length > 0) {
//             recipe.ingredients.forEach(ing => {
//                 text += `- ${ing.quantity} ${ing.name}\n`;
//             });
//         }
//         text += "\nPrzygotowanie:\n";
//         if (recipe.preparationSteps && recipe.preparationSteps.length > 0) {
//             recipe.preparationSteps.forEach((step, i) => {
//                 text += `${i + 1}. `;
//                 if (step.content) {
//                     // Simple extraction of text from PortableText; for full rich text, use a serializer
//                     step.content.forEach(block => {
//                         if (block.children) {
//                             block.children.forEach(child => {
//                                 if (child.text) {
//                                     text += child.text + " ";
//                                 }
//                             });
//                         }
//                     });
//                 }
//                 if (step.notes) {
//                     text += `(${step.notes})`;
//                 }
//                 text += "\n";
//             });
//         }
//         text += `\nŹródło: ${BASE_URL}/recipes/${slug}`; // Add URL at very end
//         return text;
//     };

//     const handleCopy = async () => {
//         const text = generateCopyableText();
//         await navigator.clipboard.writeText(text);
//         // Optional: Add snackbar/toast for feedback
//         alert("Skopiowano składniki i kroki przygotowania do schowka!");
//     };

//     return (
//         <Button variant="outlined" onClick={handleCopy} sx={styles.copyButton}>
//             Kopiuj składniki i przygotowanie do dokumentu
//         </Button>
//     );
// }
// app/recipes/[slug]/parts/RecipeCopyButton.tsx (updated: added Snackbar toast for copy feedback)
"use client";

import { Button, Snackbar, Alert } from "@mui/material";
import { useState } from "react";
import { Recipe } from "@/lib/types";
import { styles } from "../styles";

interface RecipeCopyButtonProps {
    recipe: Recipe;
    slug: string;
}

export function RecipeCopyButton({ recipe, slug }: RecipeCopyButtonProps) {
    const [open, setOpen] = useState(false);
    // Configurable base URL - update NEXT_PUBLIC_BASE_URL in .env.local after publishing to Vercel
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    const generateCopyableText = (): string => {
        let text = `${recipe.title}\n\n`; // Add recipe title at top
        text += "Składniki:\n";
        if (recipe.ingredients && recipe.ingredients.length > 0) {
            recipe.ingredients.forEach(ing => {
                text += `- ${ing.quantity} ${ing.name}\n`;
            });
        }
        text += "\nPrzygotowanie:\n";
        if (recipe.preparationSteps && recipe.preparationSteps.length > 0) {
            recipe.preparationSteps.forEach((step, i) => {
                text += `${i + 1}. `;
                if (step.content) {
                    // Simple extraction of text from PortableText; for full rich text, use a serializer
                    step.content.forEach(block => {
                        if (block.children) {
                            block.children.forEach(child => {
                                if (child.text) {
                                    text += child.text + " ";
                                }
                            });
                        }
                    });
                }
                if (step.notes) {
                    text += `(${step.notes})`;
                }
                text += "\n";
            });
        }
        text += `\nŹródło: ${BASE_URL}/recipes/${slug}`; // Add URL at very end
        return text;
    };

    const handleCopy = async () => {
        const text = generateCopyableText();
        try {
            await navigator.clipboard.writeText(text);
            setOpen(true);
        } catch (err) {
            console.error("Failed to copy text: ", err);
            // Fallback alert if clipboard fails
            alert("Nie udało się skopiować. Spróbuj ponownie.");
        }
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
            <Button variant="outlined" id="RecipeCopyButton" onClick={handleCopy} sx={styles.copyButton}>
                Kopiuj składniki i przygotowanie do dokumentu
            </Button>
            <Snackbar open={open} autoHideDuration={3000} onClose={handleClose} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
                <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
                    Skopiowano do schowka!
                </Alert>
            </Snackbar>
        </>
    );
}
