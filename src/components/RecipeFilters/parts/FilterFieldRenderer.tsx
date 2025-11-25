import { FilterField } from "@/hooks/useCreateRecipeFilterFields";
import { FilterState } from "@/types";
import { Box } from "@mui/material";
import { ChipFieldKey } from "../RecipeFilters";
import { fieldBoxSx } from "../styles";
import FilterAutocomplete from "./FilterAutocomplete";
import { renderLimitedChips } from "./renderLimitedChips";
import { useTheme } from "@mui/material/styles";

interface Props {
    field: FilterField;
    filters: FilterState;
    handleChange: (key: keyof FilterState, value: string | string[]) => void;

    getErrorProps: (key: keyof FilterState) => {
        error: boolean;
        helperText: string;
    };
}

export const FilterFieldRendrerer = ({ field, filters, handleChange, getErrorProps }: Props) => {
    const theme = useTheme();
    return (
        <Box sx={fieldBoxSx} key={field.key}>
            <FilterAutocomplete
                label={field.label}
                options={field.options}
                value={filters[field.key]}
                multiple={field.multiple}
                placeholder={field.placeholder}
                onChange={(newValue: string | string[] | null) => {
                    const normalized = newValue ?? (field.multiple ? [] : "");
                    handleChange(field.key, normalized);
                }}
                renderTags={field.chips && ["tags", "products", "dietary"].includes(field.key) ? value => renderLimitedChips(value, field.key as ChipFieldKey, theme, handleChange) : undefined}
                {...getErrorProps(field.key)}
            />
        </Box>
    );
};

export default FilterFieldRendrerer;
