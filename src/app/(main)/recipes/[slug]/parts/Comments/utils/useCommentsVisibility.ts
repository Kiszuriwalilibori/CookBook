import { useMemo, useState } from "react";

type ViewMode = "preview" | "expanded" | "collapsed";

export function useCommentsVisibility<T>(items: T[], previewCount = 3) {
    const [viewMode, setViewMode] = useState<ViewMode>("preview");

    const visibleItems = useMemo(() => {
        if (viewMode === "expanded") return items;
        if (viewMode === "preview") return items.slice(0, previewCount);
        return [];
    }, [items, viewMode, previewCount]);

    const hiddenCount = Math.max(items.length - previewCount, 0);

    function toggleCommentsVisibility() {
        setViewMode(prev => {
            if (prev === "preview") return "expanded";
            if (prev === "expanded") return "collapsed";
            return "expanded";
        });
    }

    const buttonLabel = useMemo(() => {
        if (viewMode === "preview") {
            return hiddenCount > 0 ? `Pokaż więcej (${hiddenCount})` : "Pokaż komentarze";
        }

        if (viewMode === "expanded") {
            return "Zwiń komentarze";
        }

        return "Pokaż komentarze";
    }, [viewMode, hiddenCount]);

    return {
        viewMode,
        visibleItems,
        hiddenCount,
        toggleCommentsVisibility,
        buttonLabel,
        hasAny: items.length > 0,
        setViewMode,
    };
}
export default useCommentsVisibility;
