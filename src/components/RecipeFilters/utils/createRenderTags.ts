import type { Theme } from "@mui/material/styles";

import type { FilterValuesTypes, FilterState } from "@/types";
import Chips from "../parts/Chips";

type ChipEligibleKey = "tags" | "products" | "dietary";

export function createRenderTags(key: keyof FilterState, chipsEnabled: boolean, theme: Theme, handleChange: (key: ChipEligibleKey, value: FilterValuesTypes) => void) {
    if (!chipsEnabled) return undefined;

    const eligibleKeys: ChipEligibleKey[] = ["tags", "products", "dietary"];

    if (!eligibleKeys.includes(key as ChipEligibleKey)) return undefined;

    const chipKey = key as ChipEligibleKey;

    return (value: string[]) => Chips(value, chipKey, theme, handleChange);
}
// todo type ChipEligibleKey powinien być powiązany z Recipe czy czymkolwiek

// todo kliknięcie na krzyżyk w filtrach zamyka je całe a mialo tylko czyścić jedno (ale tak działa tylko przed wyborem)
