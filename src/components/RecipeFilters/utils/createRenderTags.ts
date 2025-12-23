import type { Theme } from "@mui/material/styles";
import Chips from "../parts/Chips";
import { FilterState } from "@/models/filters";
import { ChipEligibleKey, FilterValuesTypes } from "@/models/filters";

export function createRenderTags(key: keyof FilterState, chipsEnabled: boolean, theme: Theme, handleChange: (key: ChipEligibleKey, value: FilterValuesTypes) => void) {
    if (!chipsEnabled) return undefined;

    const eligibleKeys: ChipEligibleKey[] = ["tags", "products", "dietary"];

    if (!eligibleKeys.includes(key as ChipEligibleKey)) return undefined;

    const chipKey = key as ChipEligibleKey;

    return (value: string[]) => Chips(value, chipKey, theme, handleChange);
}
