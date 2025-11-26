"use client";

import React, { useCallback } from "react";
import { useRouter } from "next/navigation";
import { Box, Button, Typography, Divider, CircularProgress } from "@mui/material";

import { containerSx, buttonGroupSx, dividerSx } from "./styles";
import { FilterSummary } from "./parts";
import { FilterState, RecipeFilter } from "@/types";
import { useFilters, useCreateRecipeFilterFields } from "@/hooks";
import { useFiltersStore } from "@/stores";

import { searchRecipeByTitle } from "@/lib/searchRecipeByTitle";
import { Recipe } from "@/lib/types";
import FilterFieldRendrerer from "./parts/FilterFieldRenderer";

export type ChipFieldKey = keyof Pick<Recipe, "products" | "tags" | "dietary">;
interface RecipeFiltersProps {
    onFiltersChange: (filters: FilterState) => void;
    onClose?: () => void;
    options: RecipeFilter;
}

export default function RecipeFilters({ onFiltersChange, onClose, options }: RecipeFiltersProps) {
    const router = useRouter();

    const { filters, errors, handleChange, clear, apply } = useFilters(options, onFiltersChange);
    const { setFilters } = useFiltersStore();

    const buildQueryString = useCallback((filters: FilterState): string => {
        const params = new URLSearchParams();

        Object.entries(filters).forEach(([key, value]) => {
            if (Array.isArray(value)) {
                value.forEach(item => params.append(key, item));
                return;
            }

            if (typeof value === "boolean") {
                if (value) params.set(key, "true"); // only include when true
                return;
            }

            if (value && value !== "") {
                params.set(key, value);
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
            console.log("slug", slug);
            if (slug) {
                router.push(`/recipes/${slug}`);
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
        console.log("hasOnlyTitle", hasOnlyTitle);
        if (hasOnlyTitle) setCheckingDirect(true);
        await handleApply();
        setCheckingDirect(false);
    };
    console.log("filterFields", filterFields);
    return (
        <Box sx={containerSx}>
            <Typography variant="h6" gutterBottom align="center">
                Filtruj Przepisy
            </Typography>
            <Divider sx={dividerSx} />

            {filterFields.map(field => (
                <FilterFieldRendrerer key={field.key} field={field} filters={filters} handleChange={handleChange} getErrorProps={getErrorProps} />
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
