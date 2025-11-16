"use client";
import { useGoogleAuth } from "@/hooks/useGoogleAuth"; // Ścieżka do hooka

interface AuthProviderProps {
    children: React.ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
    useGoogleAuth(); // Wywołaj hook—side effects only

    return <>{children}</>; // Transparent—przepuszcza children
}
