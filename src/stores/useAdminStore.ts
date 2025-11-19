// src/stores/useAdminStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AdminStore {
    isAdminLogged: boolean;
    setAdminLogged: (value: boolean, reason?: string) => void;
}

export const useAdminStore = create<AdminStore>()(
    persist(
        set => ({
            isAdminLogged: false,
            setAdminLogged: (value, reason = "manual") => {
                console.log(`[Admin Store] ${reason} → isAdminLogged = ${value}`);
                set({ isAdminLogged: value });
            },
        }),
        {
            name: "admin-storage", // klucz w localStorage
        }
    )
);
