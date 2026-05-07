"use client";

import { SnackbarProvider } from "notistack";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SnackbarProvider
            maxSnack={3}
            autoHideDuration={3000}
            anchorOrigin={{
                vertical: "top",
                horizontal: "center",
            }}
        >
            {children}
        </SnackbarProvider>
    );
}
export default Providers;
