// src/components/UserInitializer.tsx
"use client";

import { useEffect } from "react";
import { useUserStore } from "@/stores/userStore";

export default function UserInitializer({ userId }: { userId: string | null }) {
    const setUserId = useUserStore(state => state.setUserId);

    useEffect(() => {
        // setUserId(userId);
        useUserStore.setState({ userId });
    }, [userId, setUserId]);

    return null;
}
