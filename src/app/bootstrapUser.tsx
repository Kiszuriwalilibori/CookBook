"use client";

import { useEffect } from "react";

export function BootstrapUser() {
    useEffect(() => {
        fetch("/api/bootstrap-user");
    }, []);

    return null;
}
