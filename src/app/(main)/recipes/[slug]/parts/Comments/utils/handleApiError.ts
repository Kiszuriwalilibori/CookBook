import { ApiError } from "@/types";

export type ErrorHandlerMap = Partial<Record<string, (message: string) => void>>;
type TransportError = { type: "NETWORK_ERROR"; message: string } | { type: "PARSE_ERROR"; message: string } | { type: "ABORTED"; message: string };

function isTransportError(err: unknown): err is TransportError {
    return typeof err === "object" && err !== null && "type" in err && typeof (err as { type?: unknown }).type === "string";
}
export function isApiError(err: unknown): err is ApiError {
    return typeof err === "object" && err !== null && "code" in err && "message" in err;
}

export function handleApiError(err: unknown, map: Record<string, (msg: string) => void>, fallback?: (msg: string) => void) {
    console.log(err);
    // 🟡 transport errors (fetch / parse)
    if (isTransportError(err)) {
        switch (err.type) {
            case "NETWORK_ERROR":
                fallback?.("Brak połączenia z internetem");
                return;
            case "PARSE_ERROR":
                fallback?.("Błąd odpowiedzi serwera");
                return;
            case "ABORTED":
                fallback?.("Zapytanie przerwane");
                return;
        }
    }

    if (!isApiError(err)) {
        fallback?.("Nieoczekiwany błąd");
        return;
    }

    const handler = map[err.code];

    if (handler) {
        handler(err.message);
        return;
    }

    fallback?.(err.message);
}
