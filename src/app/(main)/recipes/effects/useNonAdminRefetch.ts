// "use client";
// import { useEffect } from "react";
// import { Status, type Recipe } from "@/types";
// import { getRecipesForCards } from "@/utils/getRecipesForCards";
// import { FilterState } from "@/models/filters";

// export function useNonAdminRefetch(isAdminLogged: boolean, setDisplayRecipes: (recipes: Recipe[]) => void) {
//     useEffect(() => {
//         if (!isAdminLogged) {
//             let cancelled = false;

//             const refetch = async () => {
//                 try {
//                     const filters: Partial<FilterState> = { status: [Status.Good, Status.Acceptable] };
//                     const fresh = await getRecipesForCards(filters, isAdminLogged);
//                     if (!cancelled) {
//                         setDisplayRecipes(fresh);
//                     }
//                 } catch (err) {
//                     console.error("useNonAdmin refetch failed:", err);
//                 }
//             };

//             refetch();

//             return () => {
//                 cancelled = true;
//             };
//         }
//     }, [isAdminLogged, setDisplayRecipes]);
// }
"use client";

import { useEffect, useRef } from "react";
import { useLoginStatus } from "@/stores/useAdminStore";
import { Status } from "@/types";
import { getRecipesForCards } from "@/utils/getRecipesForCards";
import { FilterState } from "@/models/filters";
import type { Recipe } from "@/types";

export function useNonAdminRefetch(setDisplayRecipes: React.Dispatch<React.SetStateAction<Recipe[]>>) {
    const loginStatus = useLoginStatus();
    const prevStatusRef = useRef<string | null>(null);

    useEffect(() => {
        const prevStatus = prevStatusRef.current;

        // ⛔ pomijamy pierwszy render
        if (prevStatus === null) {
            prevStatusRef.current = loginStatus;
            return;
        }

        // 🔥 tylko jeśli był admin i przestał nim być
        if (prevStatus === "admin" && loginStatus !== "admin") {
            const fetchNonAdmin = async () => {
                const filters: Partial<FilterState> = {
                    status: [Status.Good, Status.Acceptable],
                };

                const fresh = await getRecipesForCards(filters, false);
                setDisplayRecipes(fresh);
            };

            fetchNonAdmin();
        }

        prevStatusRef.current = loginStatus;
    }, [loginStatus, setDisplayRecipes]);
}
