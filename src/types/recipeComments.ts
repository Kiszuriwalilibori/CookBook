export interface RecipeCommentLike {
    author: string;
    fingerprint: string;
}

export interface RecipeComment {
    _id: string;

    recipeId: string; // 🔥 NOWE (ważne w flat modelu)

    parentId: string | null; // 🔥 NOWE

    content: string;
    author: string;
    createdAt: string;

    fingerprint: string;

    likesCount: number;
    likes: RecipeCommentLike[];

    replies?: RecipeComment[]; // 🔥 tylko frontend (computed)
}

export interface RecipeComments {
    [recipeId: string]: RecipeComment[];
}
