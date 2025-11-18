"use client";

import React, { useCallback } from "react";
import { useRouter } from "next/navigation";
import { Box, Button, Typography, Divider, CircularProgress } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { containerSx, fieldBoxSx, buttonGroupSx, dividerSx } from "./styles";
import { FilterSummary, FilterAutocomplete } from "./parts";
import { FilterState, Options } from "@/types";
import { useFilters, useCreateRecipeFilterFields } from "@/hooks";
import { useFiltersStore } from "@/stores";
import { renderLimitedChips } from "./parts/renderLimitedChips";
import { searchRecipeByTitle } from "@/lib/searchRecipeByTitle"; // ← new utility

export type ChipFieldKey = "tag" | "product" | "dietary";

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

    // Helper: build normal query string for /recipes page
    const buildQueryString = useCallback((filters: FilterState): string => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value && value !== "") {
                if (Array.isArray(value)) {
                    value.forEach(item => params.append(key, item));
                } else {
                    params.set(key, value);
                }
            }
        });
        return params.toString();
    }, []);

    // New smart Apply logic
    const handleApply = useCallback(async () => {
        if (!apply()) return; // validation failed → do nothing

        const currentFilters = { ...filters };
        setFilters(currentFilters);

        // Detect if ONLY title is filled
        const hasOnlyTitle =
            !!currentFilters.title &&
            Object.entries(currentFilters).every(([key, value]) => {
                if (key === "title") return true;
                if (Array.isArray(value)) return value.length === 0;
                return value === "" || value == null;
            });

        // CASE 1: Only title → try direct navigation
        if (hasOnlyTitle && currentFilters.title) {
            const title = (currentFilters.title as string).trim();
            const slug = await searchRecipeByTitle(title);

            if (slug) {
                router.push(`/recipe/${slug}`);
                onClose?.();
                return;
            }

            // Optional: you can show a toast here that no exact match was found
            // For now we just fall through to normal search
        }

        // CASE 2: Normal filtering → go to /recipes list
        const queryString = buildQueryString(currentFilters);
        router.push(`/recipes${queryString ? `?${queryString}` : ""}`);
        onClose?.();
    }, [apply, filters, setFilters, router, onClose, buildQueryString]);

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

    const filterFields = useCreateRecipeFilterFields(options);

    // Simple loading state while searching for direct recipe
    const [checkingDirect, setCheckingDirect] = React.useState(false);

    const enhancedHandleApply = async () => {
        const hasOnlyTitle =
            !!filters.title &&
            Object.entries(filters).every(([k, v]) => {
                if (k === "title") return true;
                return Array.isArray(v) ? v.length === 0 : !v;
            });

        if (hasOnlyTitle) setCheckingDirect(true);
        await handleApply();
        setCheckingDirect(false);
    };

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
                        placeholder={field.placeholder}
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

                <Button variant="contained" onClick={enhancedHandleApply} size="small" disabled={checkingDirect} startIcon={checkingDirect ? <CircularProgress size={16} /> : null}>
                    {checkingDirect ? "Sprawdzam..." : "Zastosuj"}
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
