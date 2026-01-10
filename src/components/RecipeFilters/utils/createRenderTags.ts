import type { Theme } from "@mui/material/styles";
import Chips from "../parts/Chips";
import { FilterState } from "@/models/filters";
import {  ActualChipKey,FilterValuesTypes } from "@/models/filters";

export function createRenderTags(key: keyof FilterState, chipsEnabled: boolean, theme: Theme, handleChange: (key: ActualChipKey, value: FilterValuesTypes) => void) {
    if (!chipsEnabled) return undefined;

    const eligibleKeys: ActualChipKey[] = ["tags", "products", "dietary", "cuisine"];

    if (!eligibleKeys.includes(key as ActualChipKey)) return undefined;

    const chipKey = key as ActualChipKey;

    return (value: string[]) => Chips(value, chipKey, theme, handleChange);
}
