import { useMemo } from "react";

interface DietaryOptionsParams {
    dietary: string[];
    noRestrictionsLabel: string;
}

export const useDietaryOptions = ({ dietary, noRestrictionsLabel }: DietaryOptionsParams): string[] => {
    return useMemo(() => {
        return [noRestrictionsLabel, ...dietary];
    }, [dietary, noRestrictionsLabel]);
};
