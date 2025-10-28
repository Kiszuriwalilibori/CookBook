"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Box, Autocomplete, TextField, Button, Typography, Divider, Chip } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { fieldTranslations } from "@/lib/types";
import debounce from "lodash.debounce";

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

    const handleChange = (key: keyof FilterState, value: string | string[]) => {
        setSelected(prev => {
            const updated = { ...prev, [key]: value };
            debouncedApplyFilters(updated);
            return updated;
        });
    };

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
                    tags.flatMap(tag =>
                        tag
                            .split(",")
                            .map(t => t.trim().toLowerCase())
                            .filter(Boolean)
                    )
                )
            ).sort((a, b) => a.localeCompare(b, "pl"));

            setOptions({
                titles: normalizeList(titles),
                cuisines: normalizeList(cuisines),
                tags: processedTags,
                dietaryRestrictions: normalizeList(dietary),
                products: normalizeList(products),
            });
        });
    }, []);

    const applyFilters = () => {
        onFiltersChange(selected);
        onClose?.();
    };

    const clearFilters = () => {
        const cleared = { title: "", cuisine: "", tag: [], dietary: [], product: [] };
        setSelected(cleared);
        onFiltersChange(cleared);
    };

    const surfaceMain = theme.palette.surface.main;

    const dietaryOptions = React.useMemo(() => {
        const opts = ["Bez ograniczeń", ...options.dietaryRestrictions];
        return opts.sort((a, b) => {
            if (a === "Bez ograniczeń") return -1;
            if (b === "Bez ograniczeń") return 1;
            return a.localeCompare(b, "pl");
        });
    }, [options.dietaryRestrictions]);

    const labelSx = {
        "& .MuiInputLabel-root": { color: surfaceMain },
        "& .MuiInputLabel-root.MuiInputLabel-shrink": { color: surfaceMain },
        "& .MuiInputLabel-root.Mui-focused": { color: surfaceMain },
        "& .MuiOutlinedInput-root": {
            "& fieldset": { borderColor: surfaceMain },
            "&:hover fieldset": { borderColor: surfaceMain },
            "&.Mui-focused fieldset": {
                borderColor: surfaceMain,
                borderWidth: 2,
                outline: `2px solid ${theme.palette.primary.light}`,
                outlineOffset: "2px",
            },
        },
        "& .MuiAutocomplete-endAdornment svg": { color: surfaceMain },
        "& .MuiInputBase-input::placeholder": { color: theme.palette.text.disabled, opacity: 1 },
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

    const renderLimitedChips = (value: string[], key: keyof FilterState) => {
        const maxVisible = 3;
        const visibleChips = value.slice(0, maxVisible);
        const hiddenCount = value.length - maxVisible;

        return (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, maxHeight: 100, overflowY: value.length > maxVisible ? "auto" : "visible" }}>
                {visibleChips.map(option => (
                    <Chip
                        key={option}
                        label={option}
                        onDelete={() =>
                            handleChange(
                                key,
                                (value as string[]).filter(v => v !== option)
                            )
                        }
                        sx={{ backgroundColor: theme.palette.surface.light, color: "white" }}
                    />
                ))}
                {hiddenCount > 0 && <Chip label={`+${hiddenCount} więcej`} sx={{ backgroundColor: theme.palette.surface.light, color: "white" }} />}
            </Box>
        );
    };

    return (
        <React.Fragment>
            <Box sx={{ maxWidth: 400, width: "100%", position: "relative" }}>
                <Typography variant="h6" gutterBottom align="center">
                    Filtruj Przepisy
                </Typography>
                <Divider sx={{ mb: 2, borderColor: surfaceMain }} />

                <Box sx={{ mb: 2 }}>
                    <Autocomplete
                        fullWidth
                        options={options.titles}
                        value={selected.title || null}
                        onChange={(_, newValue) => handleChange("title", newValue || "")}
                        aria-label="Filtruj po tytule przepisu"
                        aria-describedby="filter-title-description"
                        renderInput={params => <TextField {...params} label={fieldTranslations.title} placeholder="Wszystkie" InputLabelProps={{ shrink: true }} sx={labelSx} />}
                    />
                </Box>

                <Typography
                    id="filter-title-description"
                    sx={{
                        position: "absolute",
                        width: 1,
                        height: 1,
                        padding: 0,
                        margin: -1,
                        overflow: "hidden",
                        clip: "rect(0, 0, 0, 0)",
                        whiteSpace: "nowrap",
                        border: 0,
                    }}
                >
                    Wybierz tytuł przepisu, aby przefiltrować wyniki.
                </Typography>

                <Box sx={{ mb: 2 }}>
                    <Autocomplete
                        fullWidth
                        options={options.cuisines}
                        value={selected.cuisine || null}
                        onChange={(_, newValue) => handleChange("cuisine", newValue || "")}
                        aria-label="Wybierz kuchnię"
                        renderInput={params => <TextField {...params} label={fieldTranslations.cuisine} placeholder="Wszystkie" InputLabelProps={{ shrink: true }} sx={labelSx} />}
                    />
                </Box>

                <Box sx={{ mb: 2 }}>
                    <Autocomplete
                        fullWidth
                        multiple
                        options={options.tags}
                        value={selected.tag}
                        onChange={(_, newValue) => handleChange("tag", newValue || [])}
                        aria-label="Wybierz tagi"
                        renderTags={(value, getTagProps) => renderLimitedChips(value, "tag")}
                        renderInput={params => <TextField {...params} label={fieldTranslations.tags} placeholder="Wszystkie" InputLabelProps={{ shrink: true }} sx={labelSx} />}
                    />
                </Box>

                <Box sx={{ mb: 2 }}>
                    <Autocomplete
                        fullWidth
                        multiple
                        options={dietaryOptions.filter(opt => opt !== "Bez ograniczeń")}
                        value={selected.dietary}
                        onChange={(_, newValue) => handleChange("dietary", newValue || [])}
                        aria-label="Wybierz ograniczenia dietetyczne"
                        getOptionLabel={option => option}
                        renderInput={params => <TextField {...params} label={fieldTranslations.dietaryRestrictions} placeholder="Wszystkie" InputLabelProps={{ shrink: true }} sx={labelSx} />}
                    />
                </Box>

                <Box sx={{ mb: 2 }}>
                    <Autocomplete
                        fullWidth
                        multiple
                        options={options.products.slice(0, 50)}
                        value={selected.product}
                        onChange={(_, newValue) => handleChange("product", newValue || [])}
                        aria-label="Wybierz produkty"
                        renderTags={(value, getTagProps) => renderLimitedChips(value, "product")}
                        renderInput={params => <TextField {...params} label="Produkt" placeholder="Wszystkie" InputLabelProps={{ shrink: true }} sx={labelSx} />}
                    />
                </Box>

                <Box sx={{ display: "flex", gap: 1, justifyContent: "center", flexWrap: "wrap" }}>
                    <Button variant="outlined" onClick={clearFilters} size="small" aria-label="Wyczyść wszystkie filtry i pokaż wszystkie przepisy" sx={{ borderColor: surfaceMain, color: surfaceMain, "&:hover": { borderColor: surfaceMain, backgroundColor: `${surfaceMain}10` } }}>
                        Wyczyść
                    </Button>
                    <Button variant="contained" onClick={applyFilters} size="small" aria-label="Zastosuj wybrane filtry do listy przepisów" sx={{ backgroundColor: surfaceMain, "&:hover": { backgroundColor: theme.palette.surface.dark } }}>
                        Zastosuj
                    </Button>
                    {onClose && (
                        <Button variant="outlined" onClick={onClose} size="small" aria-label="Zamknij panel filtrów" sx={{ borderColor: surfaceMain, color: surfaceMain, "&:hover": { borderColor: surfaceMain, backgroundColor: `${surfaceMain}10` } }}>
                            Zamknij
                        </Button>
                    )}
                </Box>

                <Typography variant="body2" align="center" sx={{ mt: 2, color: theme.palette.text.secondary }}>
                    {getFilterSummary()}
                </Typography>
            </Box>
        </React.Fragment>
    );
}
