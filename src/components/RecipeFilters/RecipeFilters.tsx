"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Box, Autocomplete, TextField, Button, Typography, Divider, Chip } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { fieldTranslations } from "@/lib/types";
import debounce from "lodash.debounce";
import { z } from "zod";

import { containerSx, fieldBoxSx, buttonGroupSx, chipContainerSx, chipSx, hiddenChipSx, summaryTextSx, labelSx } from "./styles";

interface FilterState {
    title: string;
    cuisine: string;
    tag: string[];
    dietary: string[];
    product: string[];
}

interface OptionsState {
    titles: string[];
    cuisines: string[];
    tags: string[];
    dietaryRestrictions: string[];
    products: string[];
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

    const [options, setOptions] = useState<OptionsState>({
        titles: [],
        cuisines: [],
        tags: [],
        dietaryRestrictions: [],
        products: [],
    });

    const [selected, setSelected] = useState<FilterState>({
        title: "",
        cuisine: "",
        tag: [],
        dietary: [],
        product: [],
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const debouncedApplyFilters = useMemo(
        () =>
            debounce((newFilters: FilterState) => {
                onFiltersChange(newFilters);
            }, 500),
        [onFiltersChange]
    );

    useEffect(() => {
        return () => {
            debouncedApplyFilters.cancel();
        };
    }, [debouncedApplyFilters]);

    const normalizeMultiple = (value: string[], optionsList: string[]): string[] => {
        if (!value || value.length === 0) return [];
        const normalized = value
            .map(v => v.trim().toLowerCase())
            .filter(v => v && optionsList.includes(v.toLowerCase()))
            .filter((v, i, self) => self.indexOf(v) === i);
        return normalized.sort((a, b) => a.localeCompare(b, "pl"));
    };

    function handleChange(key: "title" | "cuisine", value: string): void;
    function handleChange(key: "tag" | "dietary" | "product", value: string[]): void;
    function handleChange(key: keyof FilterState, value: string | string[]): void {
        setSelected(prev => {
            const updated = { ...prev };

            if (Array.isArray(value)) {
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
                const normalized = value.trim().toLowerCase();
                if (key === "title") updated.title = normalized;
                if (key === "cuisine") updated.cuisine = normalized;
            }

            debouncedApplyFilters(updated);
            return updated;
        });
    }

    useEffect(() => {
        Promise.all([
            fetch("/api/uniques/title").then(r => r.json()) as Promise<string[]>,
            fetch("/api/uniques/cuisine").then(r => r.json()) as Promise<string[]>,
            fetch("/api/uniques/tags").then(r => r.json()) as Promise<string[]>,
            fetch("/api/uniques/dietaryRestrictions").then(r => r.json()) as Promise<string[]>,
            fetch("/api/uniques/products").then(r => r.json()) as Promise<string[]>,
        ]).then(([titles, cuisines, tags, dietary, products]) => {
            const normalizeList = (arr: string[]) => [...new Set(arr.map(i => i.toLowerCase()))].sort((a, b) => a.localeCompare(b, "pl"));

            const processedTags = Array.from(
                new Set(
                    tags
                        .flatMap(tag =>
                            tag
                                .split(",")
                                .map(t => t.trim().toLowerCase())
                                .filter(Boolean)
                        )
                        .sort((a, b) => a.localeCompare(b, "pl"))
                )
            );

            setOptions({
                titles: normalizeList(titles),
                cuisines: normalizeList(cuisines),
                tags: processedTags,
                dietaryRestrictions: normalizeList(dietary),
                products: normalizeList(products),
            });
        });
    }, []);

    useEffect(() => {
        const normalizedSelected = { ...selected };
        const multipleKeys: ("tag" | "dietary" | "product")[] = ["tag", "dietary", "product"];
        multipleKeys.forEach(key => {
            const optionsKey = key === "tag" ? "tags" : key === "dietary" ? "dietaryRestrictions" : "products";
            const currentValue = selected[key];
            normalizedSelected[key] = normalizeMultiple(currentValue, options[optionsKey as keyof OptionsState] as string[]);
        });

        if (JSON.stringify(normalizedSelected) !== JSON.stringify(selected)) {
            setSelected(normalizedSelected);
            debouncedApplyFilters(normalizedSelected);
        }
    }, [options]); // eslint-disable-line react-hooks/exhaustive-deps

    const applyFilters = () => {
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

    const renderLimitedChips = (value: string[], key: "tag" | "product") => {
        const maxVisible = 3;
        const visibleChips = value.slice(0, maxVisible);
        const hiddenCount = value.length - maxVisible;

        return (
            <Box
                sx={{
                    ...chipContainerSx,
                    overflowY: value.length > maxVisible ? "auto" : "visible",
                }}
            >
                {visibleChips.map(option => (
                    <Chip
                        key={option}
                        label={option}
                        onDelete={() =>
                            handleChange(
                                key,
                                value.filter(v => v !== option)
                            )
                        }
                        sx={chipSx(theme)}
                    />
                ))}
                {hiddenCount > 0 && <Chip label={`+${hiddenCount} więcej`} sx={hiddenChipSx(theme)} />}
            </Box>
        );
    };

    const getFilterSummary = () => {
        const activeValues: string[] = [];
        if (selected.cuisine) activeValues.push(selected.cuisine);
        if (selected.title) activeValues.push(selected.title);
        if (selected.tag.length) activeValues.push(...selected.tag);
        if (selected.dietary.length) activeValues.push(...selected.dietary);
        if (selected.product.length) activeValues.push(...selected.product);

        const count = activeValues.length;
        if (count === 0) return "Brak aktywnych filtrów.";

        const filtrWord = count === 1 ? "filtr" : count % 10 >= 2 && count % 10 <= 4 && (count < 10 || count > 20) ? "filtry" : "filtrów";
        const aktywnyWord = count === 1 ? "aktywny" : count % 10 >= 2 && count % 10 <= 4 && (count < 10 || count > 20) ? "aktywne" : "aktywnych";

        return `${count} ${filtrWord} ${aktywnyWord}: ${activeValues.join(", ")}`;
    };

    return (
        <Box sx={containerSx}>
            <Typography variant="h6" gutterBottom align="center">
                Filtruj Przepisy
            </Typography>
            <Divider sx={{ mb: 2 }} />

            {/* Title */}
            <Box sx={fieldBoxSx}>
                <Autocomplete
                    fullWidth
                    options={options.titles}
                    value={selected.title || null}
                    onChange={(_, newValue) => handleChange("title", newValue || "")}
                    renderInput={params => <TextField {...params} label={fieldTranslations.title} placeholder="Wszystkie" InputLabelProps={{ shrink: true }} sx={labelSx(theme)} />}
                />
            </Box>

            {/* Cuisine */}
            <Box sx={fieldBoxSx}>
                <Autocomplete
                    fullWidth
                    options={options.cuisines}
                    value={selected.cuisine || null}
                    onChange={(_, newValue) => handleChange("cuisine", newValue || "")}
                    renderInput={params => <TextField {...params} label={fieldTranslations.cuisine} placeholder="Wszystkie" InputLabelProps={{ shrink: true }} sx={labelSx(theme)} />}
                />
            </Box>

            {/* Tags */}
            <Box sx={fieldBoxSx}>
                <Autocomplete
                    fullWidth
                    multiple
                    options={options.tags}
                    value={selected.tag}
                    onChange={(_, newValue) => handleChange("tag", newValue || [])}
                    renderTags={value => renderLimitedChips(value, "tag")}
                    renderInput={params => <TextField {...params} label={fieldTranslations.tags} placeholder="Wszystkie" InputLabelProps={{ shrink: true }} sx={labelSx(theme)} error={!!errors.tag} helperText={errors.tag} />}
                />
            </Box>

            {/* Dietary */}
            <Box sx={fieldBoxSx}>
                <Autocomplete
                    fullWidth
                    multiple
                    options={dietaryOptions.filter(opt => opt !== "Bez ograniczeń")}
                    value={selected.dietary}
                    onChange={(_, newValue) => handleChange("dietary", newValue || [])}
                    renderTags={value => renderLimitedChips(value, "product")}
                    renderInput={params => <TextField {...params} label={fieldTranslations.dietaryRestrictions} placeholder="Wszystkie" InputLabelProps={{ shrink: true }} sx={labelSx(theme)} />}
                />
            </Box>

            {/* Products */}
            <Box sx={fieldBoxSx}>
                <Autocomplete
                    fullWidth
                    multiple
                    options={options.products.slice(0, 50)}
                    value={selected.product}
                    onChange={(_, newValue) => handleChange("product", newValue || [])}
                    renderTags={value => renderLimitedChips(value, "product")}
                    renderInput={params => <TextField {...params} label="Produkt" placeholder="Wszystkie" InputLabelProps={{ shrink: true }} sx={labelSx(theme)} />}
                />
            </Box>

            {/* Buttons */}
            <Box sx={buttonGroupSx}>
                <Button variant="outlined" color="primary" onClick={clearFilters} size="small">
                    Wyczyść
                </Button>
                <Button variant="contained" color="primary" onClick={applyFilters} size="small">
                    Zastosuj
                </Button>
                {onClose && (
                    <Button variant="outlined" color="primary" onClick={onClose} size="small">
                        Zamknij
                    </Button>
                )}
            </Box>

            <Typography variant="body2" align="center" sx={summaryTextSx(theme)}>
                {getFilterSummary()}
            </Typography>
        </Box>
    );
}
