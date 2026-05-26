import { ApiResponse } from "./handleError";

const e = err as Record<string, unknown>;
const type = e.type;

export async function safeFetch<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
    try {
        const res = await fetch(input, init);

        let data: ApiResponse<T>;

        try {
            data = await res.json();
        } catch {
            throw { type: "PARSE_ERROR" };
        }

        if (!data.ok) {
            throw data.error;
        }

        return data.data;
    } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
            throw { type: "ABORTED" };
        }

        if ((err as any)?.type) {
            throw err; // transport error already normalized
        }

        throw { type: "NETWORK_ERROR" };
    }
}
