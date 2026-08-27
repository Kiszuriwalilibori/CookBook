"use client";

import { SnackbarProvider } from "notistack";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function Providers({ children }: { children: React.ReactNode }) {
    const prefersReducedMotion = useReducedMotion();

    return (
        <SnackbarProvider
            maxSnack={3}
            autoHideDuration={3000}
            anchorOrigin={{
                vertical: "top",
                horizontal: "center",
            }}
            transitionDuration={prefersReducedMotion ? 0 : undefined}
        >
            {children}
        </SnackbarProvider>
    );
}
export default Providers;
