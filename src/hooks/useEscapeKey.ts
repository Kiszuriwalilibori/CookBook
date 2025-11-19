import { useEffect } from "react";

export const useEscapeKey = (isOpen: boolean, onClose: () => void, options: { preventDefault?: boolean } = {}) => {
    const { preventDefault = true } = options;

    useEffect(() => {
        if (!isOpen) return;

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                if (preventDefault) event.preventDefault();
                onClose();
            }
        };

        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, [isOpen, onClose, preventDefault]);
};
export default useEscapeKey;
