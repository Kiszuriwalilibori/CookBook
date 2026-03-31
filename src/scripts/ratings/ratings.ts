import { RecipeRating } from "@/types";

export interface RecipeRatingInput {
    recipeTitle: string;
    ratings: RecipeRating[];
}

export const ratings:RecipeRatingInput = {
    recipeTitle: "Kurczak w sezamie po chińsku",
    ratings: [
        {
            rating: 4,
            fingerprint: "fp_new_11aa3d",
            updatedAt: new Date().toISOString(),
        },
        {
            rating: 5,
            fingerprint: "fp_new_92bc71",
            updatedAt: new Date().toISOString(),
        },
        {
            rating: 3,
            fingerprint: "fp_new_f81c0e",
            updatedAt: new Date().toISOString(),
        },

        // 🔁 ISTNIEJĄCE (nadpiszą poprzednie)
        {
            rating: 1,
            fingerprint: "fp_1a9f3c7e", // było 5
            updatedAt: new Date().toISOString(),
        },
        {
            rating: 2,
            fingerprint: "fp_7b2d91aa", // było 3
            updatedAt: new Date().toISOString(),
        },
    ],
};
