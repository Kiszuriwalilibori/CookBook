// src/store/userStore.ts
import { create } from "zustand";

interface UserStore {
    userId: string | null;
    setUserId: (userId: string | null) => void;
}

// export const useUserStore = create<UserStore>(set => ({
//     userId: null,
//     setUserId: userId => set({ userId }),
// }));

// src/store/userStore.ts

export const useUserStore = create<UserStore>(set => ({
    userId: null,
    setUserId: userId => set({ userId }),
}));

// Selektory
export const useGetUserId = () => useUserStore(state => state.userId);
export const useIsUserSet = () => useUserStore(state => state.userId !== null);

export const useUserActions = () =>
    useUserStore(state => ({
        setUserId: state.setUserId,
    }));
