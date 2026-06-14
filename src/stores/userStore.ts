// src/store/userStore.ts
import { create } from "zustand";

interface UserStore {
    userId: string | null;
    setUserId: (userId: string | null) => void;
}

export const useUserStore = create<UserStore>(set => ({
    userId: null,
    setUserId: userId => set({ userId }),
}));
