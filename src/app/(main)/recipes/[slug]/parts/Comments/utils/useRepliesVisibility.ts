"use client";
import { RecipeComment } from "@/types";
import { useState } from "react";

export function useRepliesVisibility(replies?: RecipeComment[] | null) {
    const [showReplies, setShowReplies] = useState(false);

    const safeReplies = (replies ?? []).filter(Boolean);

    return {
        showReplies,
        visibleReplies: safeReplies.length <= 1 ? safeReplies : showReplies ? safeReplies : safeReplies.slice(0, 1),

        hiddenRepliesCount: safeReplies.length > 1 ? safeReplies.length - 1 : 0,

        toggleRepliesVisibility: () => setShowReplies(prev => !prev),
    };
}
