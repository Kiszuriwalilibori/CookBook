"use client";

import { useEffect } from "react";

type GlobalErrorProps = {
    error: Error & { digest?: string };
    reset: () => void;
};

export default function GlobalError({ error, reset }: GlobalErrorProps) {
    useEffect(() => {
        console.error("Critical application error:", {
            message: error.message,
            digest: error.digest,
            error,
        });
    }, [error]);

    return (
        <html lang="pl">
            <body
                style={{
                    margin: 0,
                    fontFamily: "Arial, Helvetica, sans-serif",
                    color: "#171717",
                    background: "#ffffff",
                }}
            >
                <main
                    role="alert"
                    style={{
                        minHeight: "100vh",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "16px",
                        padding: "24px",
                        boxSizing: "border-box",
                        textAlign: "center",
                    }}
                >
                    <h1>Wystąpił krytyczny błąd</h1>

                    <p>Aplikacja nie mogła się poprawnie uruchomić. Spróbuj ponownie.</p>

                    {error.digest ? <p style={{ fontSize: "0.875rem" }}>Identyfikator błędu: {error.digest}</p> : null}

                    <button
                        type="button"
                        onClick={reset}
                        style={{
                            padding: "10px 18px",
                            border: 0,
                            borderRadius: "8px",
                            background: "#BC5A3C",
                            color: "#ffffff",
                            cursor: "pointer",
                            fontSize: "1rem",
                        }}
                    >
                        Spróbuj ponownie
                    </button>
                </main>
            </body>
        </html>
    );
}
