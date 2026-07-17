export type RatingValue = 1 | 2 | 3 | 4 | 5;

export interface RecipeRating {
    _key?: string;
    rating: RatingValue;
    fingerprint: string;
    updatedAt: string;
}
export interface PatchRecipeRatingsInput {
    recipeTitle: string;
    ratings: RecipeRating[];
}

export interface RatingSummary {
    average: number | null;
    count: number;
}

export type RatingMutationResult =
    | {
          status: "updated";
          ratingSummary: RatingSummary;
          ratingSent: RatingValue;
      }
    | {
          status: "exists";
          existingRating: RecipeRating;
      }
    | {
          status: "noChange";
          existingRating: RecipeRating;
      };
export interface RatingPayload extends Omit<RecipeRating, "_key" | "updatedAt"> {
    recipeId: string;
    overwrite?: boolean;
}
