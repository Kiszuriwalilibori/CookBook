import { create } from "zustand";

interface AdminStore {
    isAdminLogged: boolean;
    setAdminLogged: (value: boolean, reason: string) => void;
}

export const useAdminStore = create<AdminStore>((set, get) => ({
    isAdminLogged: false,
    setAdminLogged: (value: boolean, reason: string) => {
        set({ isAdminLogged: value });
        console.log(`[Admin Store Update] ${reason}. New state: isAdminLogged = ${value}`);
    },
}));
