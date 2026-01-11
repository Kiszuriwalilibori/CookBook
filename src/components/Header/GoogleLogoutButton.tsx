"use client";
import { Button } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { useLoginStatus, useSetLoginStatus } from "@/stores/useAdminStore";
import { useRouter, usePathname } from "next/navigation";
import { logoutButtonWrapper } from "./Header.styles";

export const GoogleLogoutButton = () => {
    const loginStatus = useLoginStatus();
    const setLoginStatus = useSetLoginStatus();
    const router = useRouter();
    const pathname = usePathname();

    const handleLogout = () => {
        // 1. Wylogowanie
        setLoginStatus("not_logged", "wylogowanie ręczne");

        // 2. Czyścimy query params (zostajemy na tej samej ścieżce)
        router.replace(pathname, { scroll: false });

        // 3. Wymuszamy odświeżenie danych (Server Components)
        router.refresh();
    };

    if (loginStatus === "not_logged") return null;

    return (
        <Button 
            sx={logoutButtonWrapper} 
            variant="contained" 
            color="error" 
            size="small" 
            startIcon={<LogoutIcon />} 
            onClick={handleLogout}
        >
            Wyloguj
        </Button>
    );
};

export default GoogleLogoutButton;