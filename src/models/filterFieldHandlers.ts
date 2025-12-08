export class FilterFieldHandlers {
    static string(field: string, value: string, opts: { mode?: "equals" | "match" | "prefix" } = {}): string | undefined {
        if (!value) return;
        const normalized = value.toLowerCase();

        switch (opts.mode) {
            case "match":
                return `lower(${field}) match "${normalized}"`;
            case "prefix":
                return `lower(${field}) match "${normalized}*"`;
            default:
                return `lower(${field}) == "${normalized}"`;
        }
    }

    static boolean(field: string, value: boolean): string | undefined {
        return value ? `${field} == true` : undefined;
    }

    static array(field: string, value: string[]): string | undefined {
        if (!value?.length) return;
        const normalized = value.map(v => v.toLowerCase());
        return `count((${field}[])[@ in ${JSON.stringify(normalized)}]) > 0`;
    }
}
