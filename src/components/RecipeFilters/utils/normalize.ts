// utils/filters.ts
export const normalizeList = (arr: string[]): string[] => {
    return [...new Set(arr.map(i => i.toLowerCase()))].sort((a, b) => a.localeCompare(b, "pl"));
};

export const normalizeTags = (tags: string[]): string[] => {
    return Array.from(
        new Set(
            tags
                .flatMap(tag =>
                    tag
                        .split(",")
                        .map(t => t.trim().toLowerCase())
                        .filter(Boolean)
                )
                .sort((a, b) => a.localeCompare(b, "pl"))
        )
    );
};

export const normalizeMultiple = (value: string[], optionsList: string[]): string[] => {
    if (!value || value.length === 0) return [];
    const normalized = value
        .map(v => v.trim().toLowerCase())
        .filter(v => v && optionsList.includes(v.toLowerCase()))
        .filter((v, i, self) => self.indexOf(v) === i);
    return normalized.sort((a, b) => a.localeCompare(b, "pl"));
};
