"use client";

import React, { useCallback } from "react";
import { useRouter } from "next/navigation";
import { Box, Button, Typography, Divider, CircularProgress } from "@mui/material";

import { FilterFieldRenderer, FilterSummary } from "./parts";
import { containerSx, buttonGroupSx, dividerSx } from "./styles";
import { buildQueryString } from "./utils/buildQueryStrings";

import { RecipeFilter, Recipe } from "@/types";
import { FilterField } from "@/hooks/useCreateRecipeFilterFields";
import { useFilters, useCreateRecipeFilterFields } from "@/hooks";
import { useFiltersStore } from "@/stores";
import { FilterState } from "@/models/filters";
import { searchRecipeByTitle } from "@/utils/searchRecipeByTitle";

export type ChipFieldKey = keyof Pick<Recipe, "products" | "tags" | "dietary" | "cuisine">;
interface RecipeFiltersProps {
    onFiltersChange: (filters: FilterState) => void;
    onClose?: () => void;
    options: RecipeFilter;
}

export default function RecipeFilters({ onFiltersChange, onClose, options }: RecipeFiltersProps) {
    const router = useRouter();

    const { filters, errors, handleChange, clear, apply } = useFilters(options, onFiltersChange);
    const { setFilters } = useFiltersStore();
    

    // New smart Apply logic
    const handleApply = useCallback(async () => {
        if (!apply()) return; // validation failed → do nothing

        const currentFilters = { ...filters };
        setFilters(currentFilters);

        // Detect if ONLY title is filled
        if (currentFilters.title) {
            const title = (currentFilters.title as string).trim();
            const slug = await searchRecipeByTitle(title);

            if (slug) {
                router.push(`/recipes/${slug}`);
                onClose?.();
                return;
            }

            // Optional: You can show a toast here that no exact match was found
        }

        // CASE 2: Normal filtering → go to /recipes list
        const queryString = buildQueryString(currentFilters);
        console.log("queryString", queryString);
        router.push(`/recipes${queryString ? `?${queryString}` : ""}`);
        onClose?.();
    }, [apply, filters, setFilters, router, onClose]);

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
                if (k === "status") return true;
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

            {filterFields.map((field: FilterField) => (
                <FilterFieldRenderer key={field.key} field={field} filters={filters} handleChange={handleChange} getErrorProps={getErrorProps} />
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
