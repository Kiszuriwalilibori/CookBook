import { create } from "zustand";

type LoginStatus = "admin" | "user" | "not_logged";

interface AdminStore {
    loginStatus: LoginStatus;
    setLoginStatus: (value: LoginStatus, reason?: string) => void;
}

export const useAdminStore = create<AdminStore>()((set) => ({
    loginStatus: "not_logged",
    setLoginStatus: (value, reason = "manual") => {
        console.log(`[Auth Store] ${reason} → loginStatus = ${value}`);
        set({ loginStatus: value });
    },
}));

// Pomocnicze hooki dla kompatybilności wstecznej
export const useIsAdminLogged = () => {
    return useAdminStore(state => state.loginStatus === "admin");
};

export const useIsUserLogged = () => {
    return useAdminStore(state => state.loginStatus === "user");
};

export const useLoginStatus = () => {
    return useAdminStore(state => state.loginStatus);
};

export const useSetLoginStatus = () => {
    return useAdminStore(state => state.setLoginStatus);
};