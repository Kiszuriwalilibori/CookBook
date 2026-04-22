import { RecipeIngredientsInput } from "@/types/ingredients";

export const ingredients: RecipeIngredientsInput = {
    title: "Fasola w sosie kokosowym",
    ingredients: [
        { name: "fasola", quantity: 2, unit: "puszki", excluded: false },
        { name: "cebula", quantity: 1, excluded: false },
        { name: "pomidory", quantity: 1, unit: "puszka", excluded: false },
        { name: "imbir", quantity: 1, unit: "łyżeczka", excluded: false },
        { name: "czosnek", quantity: 2, unit: "ząbki", excluded: false },
        { name: "kurkuma", quantity: 1, unit: "łyżeczka", excluded: false },
        { name: "kmin rzymski", quantity: 1, unit: "łyżeczka", excluded: false },
        { name: "cynamon", quantity: 0.25, unit: "łyżeczki", excluded: false },
        { name: "mleko kokosowe", quantity: 400, unit: "mililitry", excluded: false },
        { name: "sól", quantity: 1, excluded: false },
        { name: "kolendra ziele", quantity: 1, unit: "garść", excluded: false },
        { name: "olej", quantity: 2, unit: "łyżki", excluded: false },
    ],
};
