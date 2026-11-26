"use client";

import { LastRecipes } from "@/utils/LastRecipes";
import { useEffect } from "react";

export default function LastRecipesTracker() {
    useEffect(() => {
        LastRecipes.save(`${window.location.pathname}${window.location.search}`);
    }, []);

    return null;
}
