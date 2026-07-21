import { useState } from "react";

export type CarouselStatus = "loading" | "success" | "empty" | "error";

export function useCarouselStatus(initialStatus: CarouselStatus = "loading") {
    const [status, setStatus] = useState<CarouselStatus>(initialStatus);

    const setCarouselStatusLoading = () => {
        setStatus("loading");
    };

    const setCarouselStatusSuccess = () => {
        setStatus("success");
    };

    const setCarouselStatusEmpty = () => {
        setStatus("empty");
    };

    const setCarouselStatusError = () => {
        setStatus("error");
    };

    return {
        status,
        setCarouselStatusLoading,
        setCarouselStatusSuccess,
        setCarouselStatusEmpty,
        setCarouselStatusError,
    };
}

export default useCarouselStatus;
