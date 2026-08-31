"use client";
import { Button } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { useLoginStatus, useSetLoginStatus } from "@/stores/useAdminStore";
import { useRouter, usePathname } from "next/navigation";

import { useApiResponseErrorHandler, useMessage } from "@/hooks";
import { ApiResponse } from "@/models/apiResponse";
import { logoutButton } from "./GoogleLogoutButton.styles";

export const GoogleLogoutButton = () => {
    const loginStatus = useLoginStatus();
    const setLoginStatus = useSetLoginStatus();
    const handleApiResponseError = useApiResponseErrorHandler();
    const showMessage = useMessage();
    const router = useRouter();
    const pathname = usePathname();

    const handleLogout = async () => {
        try {
            const res = await fetch("/api/logout", {
                method: "POST",
            });

            const data: ApiResponse<null> = await res.json();

            if (!data.ok) {
                throw data.error;
            }

            setLoginStatus("not_logged", "wylogowanie ręczne");
            showMessage.success("Zostałeś wylogowany");
            router.replace(pathname, { scroll: false });
            router.refresh();
        } catch (error) {
            handleApiResponseError(error);
        }
    };

    if (loginStatus === "not_logged") return null;

    return (
        <Button id="GoogleLogoutButton" sx={logoutButton} variant="contained" size="small" startIcon={<LogoutIcon />} onClick={handleLogout}>
            Wyloguj
        </Button>
    );
};

export default GoogleLogoutButton;
