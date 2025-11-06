
export const normalizeMultiple = (value: string[], optionsList: string[]): string[] => {
    if (!value || value.length === 0) return [];
    const normalized = value
        .map(v => v.trim().toLowerCase())
        .filter(v => v && optionsList.includes(v.toLowerCase()))
        .filter((v, i, self) => self.indexOf(v) === i);
    return normalized.sort((a, b) => a.localeCompare(b, "pl"));
};
