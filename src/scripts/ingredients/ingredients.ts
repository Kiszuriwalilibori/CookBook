import { RecipeIngredientsInput } from "@/types/ingredients";

export const ingredients: RecipeIngredientsInput = {
    title: "Dorsz pieczony",
    ingredients: [
        { name: "filety z dorsza", quantity: 400, unit: "gramów", excluded: false },
        { name: "czosnek", quantity: 3, unit: "ząbki", excluded: false },
        { name: "oliwa", quantity: 2, unit: "łyżki", excluded: false },
        { name: "słodka papryka", quantity: 1, unit: "łyżeczka", excluded: false },
        { name: "sól", quantity: 0.5, unit: "łyżeczki", excluded: false },
        { name: "pieprz", quantity: 0.33, unit: "łyżeczki", excluded: false },
        { name: "chili", quantity: 1, unit: "szczypta", excluded: false },
        { name: "cytryna", quantity: 4, unit: "plasterki", excluded: false },
    ],
};
