type ApiResult<T> = { type: "success"; data: T } | { type: "conflict"; data: T } | { type: "error"; error: string };

export async function handleApiResponse<T>(res: Response): Promise<ApiResult<T>> {
    const data = await res.json();

    if (res.status === 409) {
        return { type: "conflict", data };
    }

    if (!res.ok) {
        return { type: "error", error: data.error || "Błąd serwera" };
    }

    return { type: "success", data };
}
