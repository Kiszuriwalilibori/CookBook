import { FilterField } from "@/hooks/useCreateRecipeFilterFields";
import { Status } from "@/types";
import { Box } from "@mui/material";
import { ChipFieldKey } from "../RecipeFilters";
import { fieldBoxSx } from "../styles";
import FilterAutocomplete from "./FilterAutocomplete";
import { Chips } from "./Chips";
import { useTheme } from "@mui/material/styles";
import { useAdminStore } from "@/stores";
import FilterSwitch from "./FilterSwitch";
import { createRenderTags } from "../utils/createRenderTags";
import { FilterState } from "@/models/filters";
import StatusFilter from "./FilterCheckbox";
import { FilterValuesTypes } from "@/models/filters";

interface Props {
    field: FilterField;
    filters: FilterState;
    handleChange: (key: keyof FilterState, value: FilterValuesTypes) => void;

    getErrorProps: (key: keyof FilterState) => {
        error: boolean;
        helperText: string;
    };
}

export const FilterFieldRendrerer = ({ field, filters, handleChange, getErrorProps }: Props) => {
    const theme = useTheme();
    const isAdminLogged = useAdminStore(state => state.isAdminLogged);

    if (!isAdminLogged && field.requiredAdmin) return null;
    if (field.key === "kizia" && !isAdminLogged) return null;

    switch (field.component) {
        case "autocomplete":
            return (
                <Box sx={fieldBoxSx} key={field.key}>
                    <FilterAutocomplete
                        label={field.label}
                        options={field.options}
                        value={filters[field.key] as string | string[]}
                        multiple={field.multiple}
                        placeholder={field.placeholder}
                        onChange={(newValue: string | string[] | null) => {
                            const normalized = newValue ?? (field.multiple ? [] : "");
                            handleChange(field.key, normalized);
                        }}
                        renderTags={createRenderTags(field.key, !!field.chips, theme, handleChange)}
                        {...getErrorProps(field.key)}
                    />
                </Box>
            );

        case "switch":
            return (
                <Box sx={fieldBoxSx} key={field.key}>
                    <FilterSwitch placeholder={field.placeholder} label={field.label} value={filters[field.key] as boolean} onChange={(checked: boolean) => handleChange(field.key, checked)} {...getErrorProps(field.key)} />
                </Box>
            );

        case "checkbox": // or whatever key/component you use for status
            return (
                <Box sx={fieldBoxSx} key={field.key}>
                    <StatusFilter label={field.label} value={filters[field.key] as Status | null} onChange={(newValue: Status) => handleChange(field.key, newValue)} {...getErrorProps(field.key)} />
                </Box>
            );

        default:
            return (
                <Box sx={fieldBoxSx} key={field.key}>
                    <FilterAutocomplete
                        label={field.label}
                        options={field.options}
                        value={filters[field.key] as string | string[]}
                        multiple={field.multiple}
                        placeholder={field.placeholder}
                        onChange={(newValue: string | string[] | null) => {
                            const normalized = newValue ?? (field.multiple ? [] : "");
                            handleChange(field.key, normalized);
                        }}
                        renderTags={field.chips && ["tags", "products", "dietary"].includes(field.key) ? value => Chips(value, field.key as ChipFieldKey, theme, handleChange) : undefined}
                        {...getErrorProps(field.key)}
                    />
                </Box>
            );
    }
};

export default FilterFieldRendrerer;
