"use client";

import { useEffect } from "react";
import { useIsUserLogged } from "@/stores/useAdminStore";
import { useFavoritesStore } from "@/stores/useFavoritesStore";

export const useResetFavoritesOnLogout = () => {
    const isUserLogged = useIsUserLogged();

    useEffect(() => {
        if (!isUserLogged) {
            useFavoritesStore.getState().reset();
        }
    }, [isUserLogged]);
};
