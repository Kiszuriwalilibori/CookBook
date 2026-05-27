"use client";

import { useEffect, useRef } from "react";
import { useLoginStatus } from "@/stores/useAdminStore";
import { getRecipesForCards } from "@/utils/getRecipesForCards";
import type { Recipe } from "@/types";

export function useAdminRefetch(setDisplayRecipes: React.Dispatch<React.SetStateAction<Recipe[]>>) {
    const loginStatus = useLoginStatus();
    const prevStatusRef = useRef<string | null>(null);

    useEffect(() => {
        const prevStatus = prevStatusRef.current;

        // ⛔ pomijamy pierwszy render
        if (prevStatus === null) {
            prevStatusRef.current = loginStatus;
            return;
        }

        // 🔥 jeśli wcześniej NIE był adminem i teraz jest adminem
        if (prevStatus !== "admin" && loginStatus === "admin") {
            const fetchAdmin = async () => {
                // brak ograniczeń statusu
                const fresh = await getRecipesForCards({}, true);
                setDisplayRecipes(fresh);
            };

            fetchAdmin();
        }

        prevStatusRef.current = loginStatus;
    }, [loginStatus, setDisplayRecipes]);
}
