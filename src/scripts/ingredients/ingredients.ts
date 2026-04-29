import { RecipeIngredientsInput } from "@/types/ingredients";

export const ingredients: RecipeIngredientsInput = {
    title: "Chilli con carne",
    ingredients: [
        { name: "mielona wołowina", quantity: 500, unit: "gram", excluded: false },
        { name: "cebula", quantity: 1, unit: "sztuki", excluded: false },
        { name: "czosnek", quantity: 4, unit: "ząbki", excluded: false },
        { name: "papryka czerwona", quantity: 1, unit: "sztuka", excluded: false },
        { name: "fasola czerwona", quantity: 560, unit: "gram", excluded: false },
        { name: "pomidory krojone", quantity: 2, unit: "puszki", excluded: false },
        { name: "koncentrat pomidorowy", quantity: 3, unit: "łyżki", excluded: false },
        { name: "woda", quantity: 500, unit: "mililitrów", excluded: false },
        { name: "papryka suszona słodka", quantity: 4, unit: "łyżeczki", excluded: false },
        { name: "kmin rzymski", quantity: 5, unit: "łyżeczek", excluded: false },
        { name: "oregano suszone", quantity: 2, unit: "łyżeczka", excluded: false },
        { name: "pieprz cayenne", quantity: 0.5, unit: "łyżeczki", excluded: false },
        { name: "sól", quantity: 2, unit: "łyżeczki", excluded: false },
        { name: "cukier", quantity: 1.5, unit: "łyżeczki", excluded: false },
        { name: "pieprz", quantity: 0.5, unit: "łyżeczki", excluded: false },
        { name: "olej", quantity: 1, unit: "łyżki", excluded: false },
    ],
};
