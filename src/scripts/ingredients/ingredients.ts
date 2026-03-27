import { RecipeIngredientsInput } from "@/types/ingredients";

// exampleIngredientsRecipe.ts
export const ingredients: RecipeIngredientsInput = {
    title: "Surówka z marchewki po marokańsku",
    ingredients: [
        { name: "marchew", quantity: 0.45, unit: "kg", excluded: false },
        { name: "rodzynki", quantity: 0.5, unit: "szklanki", excluded: false },
        { name: "oliwa", quantity: 5, unit: "łyżek", excluded: false },
        { name: "miód", quantity: 1.5, unit: "łyżki", excluded: false },
        { name: "cytryna", quantity: 1, unit: "sztuka", excluded: false },
        { name: "imbir", quantity: 0.5, unit: "łyżeczki", excluded: false },
        { name: "cynamon", quantity: 1, unit: "łyżeczka", excluded: false },
        { name: "sól", quantity: 1, unit: "do smaku", excluded: false },
        { name: "pieprz", quantity: 1, unit: "do smaku", excluded: false },
    ],
};
