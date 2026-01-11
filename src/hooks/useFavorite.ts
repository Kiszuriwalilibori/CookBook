import { useState, useEffect } from "react";
import { useAdminStore, useIsUserLogged } from "@/stores/useAdminStore";


export const useFavorite = (recipeId: string) => {
    const isUserLogged = useIsUserLogged(); // <- sprawdzamy zalogowanego usera
    const googleToken = useAdminStore(state => state.googleToken);
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        if (!isUserLogged || !googleToken) return; // <-- jeśli nie zalogowany, nie fetchujemy

        fetch("/api/favorites/list", {
            headers: { Authorization: `Bearer ${googleToken}` },
        })
            .then(res => res.json())
            .then((favorites: { recipe: { _id: string } }[]) => {
                const favIds = favorites.map(f => f.recipe._id);
                setIsFavorite(favIds.includes(recipeId));
            });
    }, [isUserLogged, googleToken, recipeId]);

    const toggleFavorite = async () => {
        if (!isUserLogged || !googleToken) return; // <- nie robimy nic, jeśli nie zalogowany

        const method = isFavorite ? "DELETE" : "POST";

        await fetch("/api/favorites", {
            method,
            headers: {
                Authorization: `Bearer ${googleToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ recipeId }),
        });

        setIsFavorite(!isFavorite);
    };

    return { isFavorite, toggleFavorite };
};
