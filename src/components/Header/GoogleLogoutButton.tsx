"use client";
import { Button } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { useAdminStore } from "@/stores";
import { useRouter, usePathname } from "next/navigation"; // ← poprawne importy
import { logoutButtonWrapper } from "./Header.styles";

export const GoogleLogoutButton = () => {
    const isAdminLogged = useAdminStore(s => s.isAdminLogged);
    const setAdminLogged = useAdminStore(s => s.setAdminLogged);
    const router = useRouter();
    const pathname = usePathname();

    const handleLogout = () => {
        // 1. Wylogowanie
        setAdminLogged(false, "wylogowanie ręczne");

        // 2. Czyścimy query params (zostajemy na tej samej ścieżce)
        router.replace(pathname, { scroll: false });

        // 3. Wymuszamy odświeżenie danych (Server Components)
        router.refresh();
    };

    if (!isAdminLogged) return null;

    return (
        <Button sx={logoutButtonWrapper} variant="contained" color="error" size="small" startIcon={<LogoutIcon />} onClick={handleLogout}>
            Wyloguj
        </Button>
    );
};

export default GoogleLogoutButton;
