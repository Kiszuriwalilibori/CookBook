import { useApiResponseErrorHandler } from "@/hooks";
import { useState, useEffect } from "react";
import { Slide } from "./Carousel.types";
import { ApiError, ApiResponse } from "@/models/apiResponse";

interface UseCarouselSlidesProps {
    count: number;
    initialSlides?: Slide[] | null;
}
async function parseApiResponse<T>(res: Response): Promise<ApiResponse<T>> {
    try {
        return await res.json();
    } catch {
        throw {
            type: "PARSE_ERROR",
            message: "Invalid JSON response",
        };
    }
}

export function useCarouselSlides({ count, initialSlides }: UseCarouselSlidesProps) {
    const [items, setItems] = useState<Slide[] | null>(initialSlides ?? null);

    const [status, setStatus] = useState<"loading" | "success" | "empty" | "error">(initialSlides === undefined || initialSlides === null ? "loading" : initialSlides.length === 0 ? "empty" : "success");

    const handleApiError = useApiResponseErrorHandler();

    useEffect(() => {
        if (initialSlides !== null) return;

        let mounted = true;

        async function load() {
            try {
                const res = await fetch(`/api/recipes/random?count=${count}`, {
                    cache: "no-store",
                });

                const result = await parseApiResponse<Slide[]>(res);

                if (!mounted) return;

                if (!result.ok) {
                    throw new ApiError(result.error.code, result.error.message);
                }

                setItems(result.data);

                setStatus(result.data.length ? "success" : "empty");
            } catch (error) {
                if (!mounted) return;

                handleApiError(error);
                setItems([]);
                setStatus("error");
            }
        }

        load();

        return () => {
            mounted = false;
        };
    }, [count, initialSlides, handleApiError]);

    return {
        items,
        status,
    };
}
