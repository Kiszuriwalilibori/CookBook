import { create } from "zustand";

interface MenuStore {
    mobileMenuOpen: boolean;
    mobileMenuHeight: number;
    setMobileMenuOpen: (open: boolean) => void;
    setMobileMenuHeight: (height: number) => void;
}

export const useMenuStore = create<MenuStore>(set => ({
    mobileMenuOpen: false,
    mobileMenuHeight: 0,

    setMobileMenuOpen: open =>
        set({
            mobileMenuOpen: open,
            ...(open ? {} : { mobileMenuHeight: 0 }),
        }),

    setMobileMenuHeight: height =>
        set({
            mobileMenuHeight: height,
        }),
}));
