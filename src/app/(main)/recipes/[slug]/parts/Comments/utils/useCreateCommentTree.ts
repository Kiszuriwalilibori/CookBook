"use client";

import { useMemo } from "react";
import { buildCommentTree } from "@/utils/buildCommentTree";
import type { RecipeComment } from "@/types";

export function useCreateCommentTree(comments: RecipeComment[] | null) {
    const safeFlatComments = useMemo(() => comments ?? [], [comments]);

    const commentTree = useMemo(() => buildCommentTree(safeFlatComments), [safeFlatComments]);

    const commentsCount = useMemo(() => safeFlatComments.length, [safeFlatComments]);

    return {
        commentTree,
        commentsCount,
    };
}
