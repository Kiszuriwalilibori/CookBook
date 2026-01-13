"use client";

import { useEffect, useState } from "react";
import { useIsUserLogged } from "@/stores/useAdminStore";

export const useFavorites = () => {
    const isUserLogged = useIsUserLogged();
    const [favorites, setFavorites] = useState<Set<string>>(new Set());

    useEffect(() => {
        if (!isUserLogged) {
            setFavorites(new Set());
            return;
        }

        fetch("/api/favorites/list", {
            credentials: "include",
        })
            .then(res => (res.ok ? res.json() : []))
            .then((data: { recipe: { _id: string } }[]) => {
                const ids = new Set(data.map(f => f.recipe._id));
                setFavorites(ids);
            });
    }, [isUserLogged]);

    const add = async (recipeId: string) => {
        await fetch("/api/favorites", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ recipeId }),
        });

        setFavorites(prev => {
            const copy = new Set(prev);
            copy.add(recipeId);
            return copy;
        });
    };

    const remove = async (recipeId: string) => {
        await fetch("/api/favorites", {
            method: "DELETE",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ recipeId }),
        });

        setFavorites(prev => {
            const copy = new Set(prev);
            copy.delete(recipeId);
            return copy;
        });
    };

    return { favorites, add, remove };
};
