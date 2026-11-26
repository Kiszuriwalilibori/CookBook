"use client";

import React, { useCallback } from "react";
import { useRouter } from "next/navigation";
import { Box, Button, Typography, Divider } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import CloseIcon from "@mui/icons-material/Close";
import { touchableSx } from "@/styles/utilityStyles";
import { LastRecipes } from "@/utils/LastRecipes";

import { FilterFieldRenderer, FilterSummary } from "./parts";
import { containerSx, buttonGroupSx, dividerSx } from "./styles";
import { buildQueryString } from "./utils/buildQueryStrings";

import { RecipeFilter, Recipe } from "@/types";
import { FilterField } from "@/hooks/useCreateRecipeFilterFields";
import { useFilters, useCreateRecipeFilterFields } from "@/hooks";
import useDelayedCondition from "@/hooks/useDelayedCondition";
import LoadingIndicator from "@/components/LoadingIndicator";

import { FilterState } from "@/models/filters";
import { searchRecipeByTitle } from "@/utils/searchRecipeByTitle";

export type ChipFieldKey = keyof Pick<Recipe, "products" | "tags" | "dietary" | "cuisine">;
const noopFiltersChange = (_filters: FilterState) => {};

interface RecipeFiltersProps {
    onFiltersChange?: (filters: FilterState) => void;
    onClose?: () => void;
    options: RecipeFilter;
    initialValues?: FilterState;
}

export default function RecipeFilters({ onFiltersChange = noopFiltersChange, onClose, options, initialValues }: RecipeFiltersProps) {
    const router = useRouter();
    const [isApplying, setIsApplying] = React.useState(false);
    const showLoading = useDelayedCondition(isApplying, 500, 1000);

    const { filters, errors, handleChange, clear, apply } = useFilters(options, onFiltersChange, initialValues);

    const handleApply = useCallback(async () => {
        if (!apply()) return;

        const currentFilters = { ...filters };

        if (currentFilters.title) {
            const title = (currentFilters.title as string).trim();
            const slug = await searchRecipeByTitle(title);

            if (slug) {
                router.push(`/recipes/${slug}`);
                onClose?.();
                return;
            }
        }

        const queryString = buildQueryString(currentFilters);

        router.push(`/recipes${queryString ? `?${queryString}` : ""}`);
        onClose?.();
    }, [apply, filters, router, onClose]);

    const handleClear = useCallback(() => {
        clear();
        LastRecipes.clear();
    }, [clear]);

    const getErrorProps = useCallback(
        (key: keyof FilterState) => ({
            error: !!errors[key],
            helperText: errors[key],
        }),
        [errors]
    );

    const filterFields = useCreateRecipeFilterFields(options);

    const [isSearchingByTitle, setIsSearchingByTitle] = React.useState(false);

    const enhancedHandleApply = async () => {
        if (isApplying) return;

        setIsApplying(true);

        const hasOnlyTitle =
            !!filters.title &&
            Object.entries(filters).every(([k, v]) => {
                if (k === "title") return true;
                if (k === "status") return true;
                return Array.isArray(v) ? v.length === 0 : !v;
            });

        if (hasOnlyTitle) setIsSearchingByTitle(true);

        try {
            await handleApply();
        } finally {
            setIsSearchingByTitle(false);
            setIsApplying(false);
        }
    };

    return (
        <Box sx={containerSx} id="RecipeFilters">
            {showLoading && <LoadingIndicator prompt="Wyszukiwanie przepisów..." />}

            <Typography variant="h6" gutterBottom align="center">
                Filtruj Przepisy
            </Typography>
            <Divider sx={dividerSx} />

            {filterFields.map((field: FilterField) => (
                <FilterFieldRenderer key={field.key} field={field} filters={filters} handleChange={handleChange} getErrorProps={getErrorProps} />
            ))}

            <Box sx={buttonGroupSx}>
                <Button variant="contained" onClick={handleClear} size="large" color="secondary" startIcon={<ClearIcon />} sx={touchableSx}>
                    Wyczyść
                </Button>

                <Button variant="contained" onClick={enhancedHandleApply} size="large" disabled={isSearchingByTitle || isApplying} startIcon={<SearchIcon />} sx={touchableSx}>
                    Zastosuj
                </Button>

                {onClose && (
                    <Button variant="outlined" onClick={onClose} size="large" startIcon={<CloseIcon />} sx={touchableSx}>
                        Zamknij
                    </Button>
                )}
            </Box>

            <FilterSummary filters={filters} />
        </Box>
    );
}
