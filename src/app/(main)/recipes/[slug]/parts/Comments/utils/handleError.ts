export type ApiError = {
    code: string;
    message: string;
};

export type ApiResponse<T> = { ok: true; data: T } | { ok: false; error: ApiError };
export type ErrorHandlerMap = Partial<Record<string, (message: string) => void>>;

export function isApiError(err: unknown): err is ApiError {
    return typeof err === "object" && err !== null && "code" in err && "message" in err;
}

export function handleApiError(err: unknown, map: Record<string, (msg: string) => void>, fallback?: (msg: string) => void) {
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
