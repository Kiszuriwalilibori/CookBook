
export const formatMinutes = (minutes: number) => `${minutes} min`;

export const formatYield = (yieldCount: number) => {
    if (yieldCount === 1) return `${yieldCount} porcja`;
    if (yieldCount >= 2 && yieldCount <= 4) return `${yieldCount} porcje`;
    return `${yieldCount} porcji`;
};

export const formatArray = (arr: string[]) => arr.join(", ");

export function hasValue<T, K extends keyof T>(obj: T, key: K): boolean {
    const value = obj[key];

    if (value == null) return false;

    if (Array.isArray(value)) return value.length > 0;

    if (typeof value === "string") return value.trim().length > 0;

    return Boolean(value); // number, boolean itp.
}
