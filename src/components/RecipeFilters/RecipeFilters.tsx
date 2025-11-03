"use client";

import React, { useCallback } from "react";
import { Box, Button, Typography, Divider, Chip } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { fieldTranslations } from "@/lib/types";

import { containerSx, fieldBoxSx, buttonGroupSx, chipContainerSx, chipSx, hiddenChipSx, dividerSx } from "./styles";
import { FilterSummary, FilterAutocomplete } from "./parts";
import { type FilterState, type OptionsState } from "@/hooks/useFilters";
import { useDietaryOptions, useFilters, useRecipeFilterOptions } from "@/hooks";

const MAX_VISIBLE_CHIPS = 3;
const MAX_PRODUCTS_DISPLAYED = 50;
const NO_DIETARY_RESTRICTIONS_LABEL = "Bez ograniczeń";

interface RecipeFiltersProps {
    onFiltersChange: (filters: FilterState) => void;
    onClose?: () => void;
}

export default function RecipeFilters({ onFiltersChange, onClose }: RecipeFiltersProps) {
    const theme = useTheme();

    const options: OptionsState = useRecipeFilterOptions();

    const { filters, errors, handleChange, clear, apply } = useFilters(options, onFiltersChange);

    const dietaryOptions = useDietaryOptions({
        dietaryRestrictions: options.dietaryRestrictions,
        noRestrictionsLabel: NO_DIETARY_RESTRICTIONS_LABEL,
    });

    const renderLimitedChips = useCallback(
        (value: readonly string[], key: "tag" | "product" | "dietary") => {
            const items = [...value];
            const visibleChips = items.slice(0, MAX_VISIBLE_CHIPS);
            const hiddenCount = Math.max(0, items.length - MAX_VISIBLE_CHIPS);

            return (
                <Box
                    sx={{
                        ...chipContainerSx,
                        overflowY: items.length > MAX_VISIBLE_CHIPS ? "auto" : "visible",
                    }}
                >
                    {visibleChips.map(option => (
                        <Chip
                            key={option}
                            label={option}
                            onDelete={() =>
                                handleChange(
                                    key as "tag" | "dietary" | "product",
                                    items.filter(v => v !== option)
                                )
                            }
                            sx={chipSx(theme)}
                            aria-label={`Usuń filtr: ${option}`} // Accessibility enhancement
                        />
                    ))}
                    {hiddenCount > 0 && <Chip label={`+${hiddenCount} więcej`} sx={hiddenChipSx(theme)} />}
                </Box>
            );
        },
        [theme, handleChange]
    );

    const handleApply = useCallback(() => {
        const success = apply();
        if (success) {
            onClose?.();
        }
    }, [apply, onClose]);

    // Helper for consistent error display across fields
    const getErrorProps = useCallback(
        (key: keyof FilterState) => ({
            error: !!errors[key],
            helperText: errors[key],
        }),
        [errors]
    );

    return (
        <Box sx={containerSx}>
            <Typography variant="h6" gutterBottom align="center">
                Filtruj Przepisy
            </Typography>
            <Divider sx={dividerSx} />

            {/* Title */}
            <Box sx={fieldBoxSx}>
                <FilterAutocomplete label={fieldTranslations.title} options={options.titles} value={filters.title} onChange={v => handleChange("title", (v ?? "") as string)} {...getErrorProps("title")} />
            </Box>

            {/* Cuisine */}
            <Box sx={fieldBoxSx}>
                <FilterAutocomplete label={fieldTranslations.cuisine} options={options.cuisines} value={filters.cuisine} onChange={v => handleChange("cuisine", (v ?? "") as string)} {...getErrorProps("cuisine")} />
            </Box>

            {/* Tags */}
            <Box sx={fieldBoxSx}>
                <FilterAutocomplete label={fieldTranslations.tags} options={options.tags} value={filters.tag} multiple onChange={v => handleChange("tag", (v ?? []) as string[])} renderTags={value => renderLimitedChips(value, "tag")} {...getErrorProps("tag")} />
            </Box>

            {/* Dietary */}
            <Box sx={fieldBoxSx}>
                <FilterAutocomplete
                    label={fieldTranslations.dietaryRestrictions}
                    options={dietaryOptions.filter(opt => opt !== NO_DIETARY_RESTRICTIONS_LABEL)}
                    value={filters.dietary}
                    multiple
                    onChange={v => handleChange("dietary", (v ?? []) as string[])}
                    renderTags={value => renderLimitedChips(value, "dietary")}
                    {...getErrorProps("dietary")}
                />
            </Box>

            {/* Products */}
            <Box sx={fieldBoxSx}>
                <FilterAutocomplete
                    label="Produkt" // TODO: Add to fieldTranslations for consistency
                    options={options.products.slice(0, MAX_PRODUCTS_DISPLAYED).sort((a, b) => a.localeCompare(b, "pl"))}
                    value={filters.product}
                    multiple
                    onChange={v => handleChange("product", (v ?? []) as string[])}
                    renderTags={value => renderLimitedChips(value, "product")}
                    {...getErrorProps("product")}
                />
            </Box>

            {/* Buttons */}
            <Box sx={buttonGroupSx}>
                <Button variant="outlined" color="primary" onClick={clear} size="small">
                    Wyczyść
                </Button>
                <Button variant="contained" color="primary" onClick={handleApply} size="small">
                    Zastosuj
                </Button>
                {onClose && (
                    <Button variant="outlined" color="primary" onClick={onClose} size="small">
                        Zamknij
                    </Button>
                )}
            </Box>
            <FilterSummary filters={filters} />
        </Box>
    );
}
