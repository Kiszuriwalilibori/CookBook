"use client";

import React, { useCallback } from "react";
import { Box, Button, Typography, Divider, Chip } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { fieldTranslations } from "@/lib/types";

import { containerSx, fieldBoxSx, buttonGroupSx, chipContainerSx, chipSx, hiddenChipSx } from "./styles";
import { FilterSummary, FilterAutocomplete } from "./parts";
import { useRecipeFilterOptions } from "@/hooks/useRecipeFilterOptions";
import { useFilters, type FilterState, type OptionsState } from "@/hooks/useFilters";

interface RecipeFiltersProps {
    onFiltersChange: (filters: FilterState) => void;
    onClose?: () => void;
}

export default function RecipeFilters({ onFiltersChange, onClose }: RecipeFiltersProps) {
    const theme = useTheme();

    const options: OptionsState = useRecipeFilterOptions();

    const { filters, errors, handleChange, clear, apply } = useFilters(options, onFiltersChange);

    const dietaryOptions = React.useMemo(() => {
        const opts = ["Bez ograniczeń", ...options.dietaryRestrictions];
        return opts.sort((a, b) => {
            if (a === "Bez ograniczeń") return -1;
            if (b === "Bez ograniczeń") return 1;
            return a.localeCompare(b, "pl");
        });
    }, [options.dietaryRestrictions]);

    const renderLimitedChips = useCallback(
        (value: readonly string[], key: "tag" | "product" | "dietary") => {
            const items = [...value];
            const maxVisible = 3;
            const visibleChips = items.slice(0, maxVisible);
            const hiddenCount = items.length - maxVisible;

            return (
                <Box
                    sx={{
                        ...chipContainerSx,
                        overflowY: items.length > maxVisible ? "auto" : "visible",
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

    return (
        <Box sx={containerSx}>
            <Typography variant="h6" gutterBottom align="center">
                Filtruj Przepisy
            </Typography>
            <Divider sx={{ mb: 2 }} />

            {/* Title */}
            <Box sx={fieldBoxSx}>
                <FilterAutocomplete label={fieldTranslations.title} options={options.titles} value={filters.title} onChange={v => handleChange("title", (v ?? "") as string)} />
            </Box>

            {/* Cuisine */}
            <Box sx={fieldBoxSx}>
                <FilterAutocomplete label={fieldTranslations.cuisine} options={options.cuisines} value={filters.cuisine} onChange={v => handleChange("cuisine", (v ?? "") as string)} />
            </Box>

            {/* Tags */}
            <Box sx={fieldBoxSx}>
                <FilterAutocomplete label={fieldTranslations.tags} options={options.tags} value={filters.tag} multiple onChange={v => handleChange("tag", (v ?? []) as string[])} renderTags={value => renderLimitedChips(value, "tag")} error={!!errors.tag} helperText={errors.tag} />
            </Box>

            {/* Dietary */}
            <Box sx={fieldBoxSx}>
                <FilterAutocomplete
                    label={fieldTranslations.dietaryRestrictions}
                    options={dietaryOptions.filter(opt => opt !== "Bez ograniczeń")}
                    value={filters.dietary}
                    multiple
                    onChange={v => handleChange("dietary", (v ?? []) as string[])}
                    renderTags={value => renderLimitedChips(value, "dietary")}
                />
            </Box>

            {/* Products */}
            <Box sx={fieldBoxSx}>
                <FilterAutocomplete label="Produkt" options={options.products.slice(0, 50)} value={filters.product} multiple onChange={v => handleChange("product", (v ?? []) as string[])} renderTags={value => renderLimitedChips(value, "product")} />
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
