// hooks/useRedirectIfNotLogged.ts
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useIsUserLogged } from "@/stores/useAdminStore";

export function useRedirectIfNotLogged(redirectTo: string = "/") {
    const router = useRouter();
    const isUserLogged = useIsUserLogged();

    useEffect(() => {
        if (!isUserLogged) {
            router.replace(redirectTo);
        }
    }, [isUserLogged, router, redirectTo]);
}
