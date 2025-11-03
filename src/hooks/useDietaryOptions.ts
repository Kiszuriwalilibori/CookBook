import { useMemo } from "react";

interface DietaryOptionsParams {
    dietaryRestrictions: string[];
    noRestrictionsLabel: string;
}

export const useDietaryOptions = ({ dietaryRestrictions, noRestrictionsLabel }: DietaryOptionsParams): string[] => {
    return useMemo(() => {
        const opts = [noRestrictionsLabel, ...dietaryRestrictions];
        return opts.sort((a, b) => {
            if (a === noRestrictionsLabel) return -1;
            if (b === noRestrictionsLabel) return 1;
            return a.localeCompare(b, "pl");
        });
    }, [dietaryRestrictions, noRestrictionsLabel]);
};
