"use client";

import { Button } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { useAdminStore } from "@/stores";
import { logoutButtonWrapper } from "./Header.styles";

export const GoogleLogoutButton = () => {
    const isAdminLogged = useAdminStore(s => s.isAdminLogged);
    const setAdminLogged = useAdminStore(s => s.setAdminLogged);

    if (!isAdminLogged) return null;

    return (
        <Button sx={logoutButtonWrapper} variant="contained" color="error" size="small" startIcon={<LogoutIcon />} onClick={() => setAdminLogged(false, "wylogowanie ręczne")}>
            Wyloguj
        </Button>
    );
};
export default GoogleLogoutButton;
