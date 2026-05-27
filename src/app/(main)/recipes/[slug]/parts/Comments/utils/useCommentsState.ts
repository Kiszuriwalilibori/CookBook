// hooks/useCommentsState.ts
import { useState, useCallback } from "react";
import type { RecipeComment } from "@/types";

export function useCommentsState() {
    const [comments, setComments] = useState<RecipeComment[] | null>(null);

    const addOptimisticComment = useCallback((optimisticComment: RecipeComment) => {
        setComments(prev => [optimisticComment, ...(prev ?? [])]);
    }, []);

    const replaceOptimisticWithReal = useCallback((tempId: string, realComment: RecipeComment) => {
        setComments(prev => (prev ?? []).map(c => (c._id === tempId ? realComment : c)));
    }, []);

    const removeOptimisticComment = useCallback((tempId: string) => {
        setComments(prev => (prev ?? []).filter(c => c._id !== tempId));
    }, []);

    const updateComment = useCallback((commentId: string, updater: (comment: RecipeComment) => RecipeComment) => {
        setComments(prev => (prev ?? []).map(c => (c._id === commentId ? updater(c) : c)));
    }, []);

    const setAllComments = useCallback((newComments: RecipeComment[]) => {
        setComments(newComments);
    }, []);

    return {
        comments,
        setAllComments,
        addOptimisticComment,
        replaceOptimisticWithReal,
        removeOptimisticComment,
        updateComment,
    };
}
