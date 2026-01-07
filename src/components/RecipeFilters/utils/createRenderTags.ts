import type { Theme } from "@mui/material/styles";
import Chips from "../parts/Chips";
import { FilterState } from "@/models/filters";
import { ChipEligibleKey, FilterValuesTypes } from "@/models/filters";

export function createRenderTags(key: keyof FilterState, chipsEnabled: boolean, theme: Theme, handleChange: (key: ChipEligibleKey, value: FilterValuesTypes) => void) {
    if (!chipsEnabled) return undefined;

    const eligibleKeys: ChipEligibleKey[] = ["tags", "products", "dietary", "cuisine"];

    if (!eligibleKeys.includes(key as ChipEligibleKey)) return undefined;

    const chipKey = key as ChipEligibleKey;

    return (value: string[]) => Chips(value, chipKey, theme, handleChange);
}
// todo tu mamy zahardkodowane chipeligiblekey, natomiast mamy także export type ChipFieldKey = keyof Pick<Recipe, "products" | "tags" | "dietary" | "cuisine">; Na coś się trzeba zdecydować
// GPT Chat wątek Typowanie Kluczy Chipowych