import { useMemo } from "react";

interface DietaryOptionsParams {
    dietaryRestrictions: string[];
    noRestrictionsLabel: string;
}

export const useDietaryOptions = ({ dietaryRestrictions, noRestrictionsLabel }: DietaryOptionsParams): string[] => {
    return useMemo(() => {
        return [noRestrictionsLabel, ...dietaryRestrictions];
    }, [dietaryRestrictions, noRestrictionsLabel]);
};
