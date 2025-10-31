"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Box, Button, Typography, Divider, Chip } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { fieldTranslations } from "@/lib/types";
import { z } from "zod";

import { containerSx, fieldBoxSx, buttonGroupSx, chipContainerSx, chipSx, hiddenChipSx } from "./styles";
import { FilterSummary, FilterAutocomplete } from "./parts";
import { useRecipeFilterOptions } from "@/hooks/useRecipeFilterOptions";
import { normalizeMultiple } from "./utils/normalize";
import { useDebounceCallback } from "@/hooks/useDebouncedCallback";

interface FilterState {
    title: string;
    cuisine: string;
    tag: string[];
    dietary: string[];
    product: string[];
}

interface RecipeFiltersProps {
    onFiltersChange: (filters: FilterState) => void;
    onClose?: () => void;
}

const FilterSchema = z.object({
    title: z.string().default(""),
    cuisine: z.string().default(""),
    tag: z.array(z.string()).max(10, "Maksymalnie 10 tagów"),
    dietary: z.array(z.string()),
    product: z.array(z.string()),
});

export default function RecipeFilters({ onFiltersChange, onClose }: RecipeFiltersProps) {
    const theme = useTheme();

    const options = useRecipeFilterOptions();

    const [selected, setSelected] = useState<FilterState>({
        title: "",
        cuisine: "",
        tag: [],
        dietary: [],
        product: [],
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const applyFilters = useCallback(
        (newFilters: FilterState) => {
            onFiltersChange(newFilters);
        },
        [onFiltersChange]
    );

    const { debounced: debouncedApplyFilters, flush: flushApplyFilters } = useDebounceCallback(applyFilters, 500);

    const handleChange = useCallback(
        <K extends keyof FilterState>(key: K, value: FilterState[K]): void => {
            setSelected(prev => {
                const updated = { ...prev };

                if (Array.isArray(value)) {
                    // multi-value case
                    let normalized: string[];
                    if (key === "tag") {
                        normalized = normalizeMultiple(value, options.tags);
                        updated.tag = normalized;
                    } else if (key === "dietary") {
                        normalized = normalizeMultiple(value, options.dietaryRestrictions);
                        updated.dietary = normalized;
                    } else if (key === "product") {
                        normalized = normalizeMultiple(value, options.products);
                        updated.product = normalized;
                    }
                } else {
                    // single-value case
                    const normalized = (value as string).trim().toLowerCase();
                    if (key === "title") updated.title = normalized;
                    if (key === "cuisine") updated.cuisine = normalized;
                }

                debouncedApplyFilters(updated);
                return updated;
            });
        },
        [options, debouncedApplyFilters]
    );

    useEffect(() => {
        if (options.tags.length === 0) return; // Skip if options not loaded yet

        setSelected(prev => {
            const normalized = { ...prev };
            const multipleKeys: ("tag" | "dietary" | "product")[] = ["tag", "dietary", "product"];
            multipleKeys.forEach(key => {
                const optionsKey = key === "tag" ? "tags" : key === "dietary" ? "dietaryRestrictions" : "products";
                const currentValue = prev[key];
                normalized[key] = normalizeMultiple(currentValue as string[], options[optionsKey as keyof typeof options] as string[]);
            });

            // Avoid JSON.stringify for performance; compare arrays directly
            let isDifferent = false;
            multipleKeys.forEach(key => {
                if (normalized[key].join(",") !== prev[key].join(",")) {
                    isDifferent = true;
                }
            });

            if (isDifferent) {
                debouncedApplyFilters(normalized);
                return normalized;
            }
            return prev;
        });
    }, [options, debouncedApplyFilters]); // Only depend on options and stable debouncedApplyFilters

    const applyFiltersButton = () => {
        flushApplyFilters(); // Immediately flush any pending debounced call
        const result = FilterSchema.safeParse(selected);
        if (!result.success) {
            const newErrors: Record<string, string> = {};
            result.error.errors.forEach(err => {
                const key = err.path[0];
                if (typeof key === "string") newErrors[key] = err.message;
            });
            setErrors(newErrors);
            return;
        }

        setErrors({});
        onFiltersChange(result.data);
        onClose?.();
    };

    const clearFilters = () => {
        const cleared = {
            title: "",
            cuisine: "",
            tag: [],
            dietary: [],
            product: [],
        };
        setSelected(cleared);
        setErrors({});
        onFiltersChange(cleared);
    };

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

    return (
        <Box sx={containerSx}>
            <Typography variant="h6" gutterBottom align="center">
                Filtruj Przepisy
            </Typography>
            <Divider sx={{ mb: 2 }} />

            {/* Title */}
            <Box sx={fieldBoxSx}>
                <FilterAutocomplete label={fieldTranslations.title} options={options.titles} value={selected.title} onChange={v => handleChange("title", (v ?? "") as string)} />
            </Box>

            {/* Cuisine */}
            <Box sx={fieldBoxSx}>
                <FilterAutocomplete label={fieldTranslations.cuisine} options={options.cuisines} value={selected.cuisine} onChange={v => handleChange("cuisine", (v ?? "") as string)} />
            </Box>

            {/* Tags */}
            <Box sx={fieldBoxSx}>
                <FilterAutocomplete label={fieldTranslations.tags} options={options.tags} value={selected.tag} multiple onChange={v => handleChange("tag", (v ?? []) as string[])} renderTags={value => renderLimitedChips(value, "tag")} error={!!errors.tag} helperText={errors.tag} />
            </Box>

            {/* Dietary */}
            <Box sx={fieldBoxSx}>
                <FilterAutocomplete
                    label={fieldTranslations.dietaryRestrictions}
                    options={dietaryOptions.filter(opt => opt !== "Bez ograniczeń")}
                    value={selected.dietary}
                    multiple
                    onChange={v => handleChange("dietary", (v ?? []) as string[])}
                    renderTags={value => renderLimitedChips(value, "dietary")}
                />
            </Box>

            {/* Products */}
            <Box sx={fieldBoxSx}>
                <FilterAutocomplete label="Produkt" options={options.products.slice(0, 50)} value={selected.product} multiple onChange={v => handleChange("product", (v ?? []) as string[])} renderTags={value => renderLimitedChips(value, "product")} />
            </Box>

            {/* Buttons */}
            <Box sx={buttonGroupSx}>
                <Button variant="outlined" color="primary" onClick={clearFilters} size="small">
                    Wyczyść
                </Button>
                <Button variant="contained" color="primary" onClick={applyFiltersButton} size="small">
                    Zastosuj
                </Button>
                {onClose && (
                    <Button variant="outlined" color="primary" onClick={onClose} size="small">
                        Zamknij
                    </Button>
                )}
            </Box>
            <FilterSummary filters={selected} />
        </Box>
    );
}
