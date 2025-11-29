import type { Theme } from "@mui/material/styles";

import Chips from "../parts/Chips";
import { ChipEligibleKey, FilterValuesTypes } from "@/hooks/useFilters";
import { FilterState } from "@/types";


export function createRenderTags(key: keyof FilterState, chipsEnabled: boolean, theme: Theme, handleChange: (key: ChipEligibleKey, value: FilterValuesTypes) => void) {
    if (!chipsEnabled) return undefined;

    const eligibleKeys: ChipEligibleKey[] = ["tags", "products", "dietary"];

    if (!eligibleKeys.includes(key as ChipEligibleKey)) return undefined;

    const chipKey = key as ChipEligibleKey;

    return (value: string[]) => Chips(value, chipKey, theme, handleChange);
}


// todo kliknięcie na krzyżyk w filtrach zamyka je całe a mialo tylko czyścić jedno (ale tak działa tylko przed wyborem)
