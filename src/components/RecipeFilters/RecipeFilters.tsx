"use client";

import React, { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Box, Button, Typography, Divider } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { containerSx, fieldBoxSx, buttonGroupSx, dividerSx } from "./styles";
import { FilterSummary, FilterAutocomplete } from "./parts";
import { FilterState, Options } from "@/types";
import { useDietaryOptions, useFilters, useCreateRecipeFilterFields } from "@/hooks";
import { useFiltersStore } from "@/stores";
import { renderLimitedChips } from "./parts/renderLimitedChips";

// 🔹 valid chip field keys
export type ChipFieldKey = "tag" | "product" | "dietary";

const MAX_PRODUCTS_DISPLAYED = 50;
const NO_DIETARY_RESTRICTIONS_LABEL = "Bez ograniczeń";

interface RecipeFiltersProps {
    onFiltersChange: (filters: FilterState) => void;
    onClose?: () => void;
    options: Options;
}

export default function RecipeFilters({ onFiltersChange, onClose, options }: RecipeFiltersProps) {
    const router = useRouter();
    const theme = useTheme();
    const { filters, errors, handleChange, clear, apply } = useFilters(options, onFiltersChange);
    const { setFilters } = useFiltersStore();
    const dietaryOptions = useDietaryOptions({
        dietaryRestrictions: options.dietaryRestrictions,
        noRestrictionsLabel: NO_DIETARY_RESTRICTIONS_LABEL,
    });

    const productOptions = useMemo(() => options.products.slice(0, MAX_PRODUCTS_DISPLAYED), [options.products]);
    const buildQueryString = useCallback((filters: FilterState): string => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value && value !== "") {
                if (Array.isArray(value)) {
                    value.forEach(v => params.append(key, v));
                } else {
                    params.set(key, value);
                }
            }
        });
        return params.toString();
    }, []);
    const handleApply = useCallback(async () => {
        if (apply()) {
            setFilters(filters);
            const queryString = buildQueryString(filters);
            router.push(`/recipes${queryString ? `?${queryString}` : ""}`);
            onClose?.();
        }
    }, [apply, filters, setFilters, onClose, router, buildQueryString]);

    const handleClear = useCallback(() => {
        clear();
        setFilters({} as FilterState);
    }, [clear, setFilters]);

    const getErrorProps = useCallback(
        (key: keyof FilterState) => ({
            error: !!errors[key],
            helperText: errors[key],
        }),
        [errors]
    );
    const filterFields = useCreateRecipeFilterFields(options, dietaryOptions, productOptions);
    console.log(filterFields, "filterFields from RecipeFilters");
    return (
        <Box sx={containerSx}>
            <Typography variant="h6" gutterBottom align="center">
                Filtruj Przepisy
            </Typography>
            <Divider sx={dividerSx} />

            {filterFields.map(field => (
                <Box sx={fieldBoxSx} key={field.key}>
                    <FilterAutocomplete
                        label={field.label}
                        options={field.options}
                        value={filters[field.key]}
                        multiple={field.multiple}
                        placeholder={field.key == "dietary" ? NO_DIETARY_RESTRICTIONS_LABEL : undefined}
                        onChange={(newValue: string | string[] | null) => {
                            const normalized = newValue ?? (field.multiple ? [] : "");
                            handleChange(field.key, normalized);
                        }}
                        renderTags={field.chips && ["tag", "product", "dietary"].includes(field.key) ? value => renderLimitedChips(value, field.key as ChipFieldKey, theme, handleChange) : undefined}
                        {...getErrorProps(field.key)}
                    />
                </Box>
            ))}

            <Box sx={buttonGroupSx}>
                <Button variant="outlined" onClick={handleClear} size="small">
                    Wyczyść
                </Button>
                <Button variant="contained" onClick={handleApply} size="small">
                    Zastosuj
                </Button>
                {onClose && (
                    <Button variant="outlined" onClick={onClose} size="small">
                        Zamknij
                    </Button>
                )}
            </Box>

            <FilterSummary filters={filters} />
        </Box>
    );
}

// todo : dietary restrictions vs dietary options, czy potrzebna zmiana?
