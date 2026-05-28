export interface RecipeComment {
    _id: string;

    recipeId: string; // 🔥 NOWE (ważne w flat modelu)

    parentId: string | null; // 🔥 NOWE

    content: string;
    author: string;
    createdAt: string;
    isAdmin?: boolean;
    fingerprint: string;
    moderationScore?: number;
    moderationReason?: string;
    shortComment?: {
        content: string;
        createdAt: string;
    } | null;

    likes: string[];

    replies?: RecipeComment[]; // 🔥 tylko frontend (computed)
}

export interface RecipeComments {
    [recipeId: string]: RecipeComment[];
}
