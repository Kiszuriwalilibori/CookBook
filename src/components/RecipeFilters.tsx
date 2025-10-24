"use client";

import React, { useState, useEffect } from "react";
import { Box, FormControl, InputLabel, Select, MenuItem, Chip, Autocomplete, TextField, FormHelperText, Button, Typography, Divider } from "@mui/material";

interface FilterState {
    cuisine: string;
    tag: string[];
    dietary: string[];
    product: string;
}

interface OptionsState {
    cuisines: string[];
    tags: string[];
    dietaryRestrictions: string[];
    products: string[];
}

interface RecipeFiltersProps {
    onFiltersChange: (filters: FilterState) => void;
    onClose?: () => void; // Explicit optional with ?
}

export default function RecipeFilters({ onFiltersChange, onClose }: RecipeFiltersProps) {
    const [options, setOptions] = useState<OptionsState>({
        cuisines: [],
        tags: [],
        dietaryRestrictions: [],
        products: [],
    });
    const [selected, setSelected] = useState<FilterState>({
        cuisine: "",
        tag: [],
        dietary: [],
        product: "",
    });

    useEffect(() => {
        Promise.all([
            fetch("/api/uniques/cuisine").then(r => r.json()) as Promise<string[]>,
            fetch("/api/uniques/tags").then(r => r.json()) as Promise<string[]>,
            fetch("/api/uniques/dietaryRestrictions").then(r => r.json()) as Promise<string[]>,
            fetch("/api/uniques/products").then(r => r.json()) as Promise<string[]>,
        ]).then(([cuisines, tags, dietary, products]) => {
            const processedTags = Array.from(
                new Set(
                    tags.flatMap(tag =>
                        tag
                            .split(",")
                            .map(t => t.trim())
                            .filter(Boolean)
                    )
                )
            ).sort((a, b) => a.localeCompare(b, "pl"));
            setOptions({ cuisines, tags: processedTags, dietaryRestrictions: dietary, products });
        });
    }, []);

    const handleChange = (key: keyof FilterState, value: string | string[]) => {
        setSelected(prev => ({ ...prev, [key]: value }));
    };

    const applyFilters = () => {
        onFiltersChange(selected);
        onClose?.(); // Optional auto-close on apply
    };

    const clearFilters = () => {
        const cleared = { cuisine: "", tag: [], dietary: [], product: "" };
        setSelected(cleared);
        onFiltersChange(cleared);
    };

    return (
        <React.Fragment>
            <Box sx={{ maxWidth: 400, width: "100%" }}>
                <Typography variant="h6" gutterBottom align="center">
                    Filtruj Przepisy
                </Typography>
                <Divider sx={{ mb: 2 }} />

                {/* Cuisine */}
                <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Kuchnia</InputLabel>
                    <Select value={selected.cuisine} label="Kuchnia" onChange={e => handleChange("cuisine", e.target.value as string)}>
                        <MenuItem value="">
                            <em>Wszystkie</em>
                        </MenuItem>
                        {options.cuisines.map(opt => (
                            <MenuItem key={opt} value={opt}>
                                {opt}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {/* Tags */}
                <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Tagi</InputLabel>
                    <Select
                        multiple
                        value={selected.tag}
                        label="Tagi"
                        renderValue={selected => (
                            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                                {(selected as string[]).map(value => (
                                    <Chip key={value} label={value} size="small" color="primary" />
                                ))}
                            </Box>
                        )}
                        onChange={e => handleChange("tag", e.target.value as string[])}
                    >
                        {options.tags.slice(0, 15).map(opt => (
                            <MenuItem key={opt} value={opt}>
                                {opt}
                            </MenuItem>
                        ))}
                    </Select>
                    <FormHelperText>{options.tags.length > 15 ? "Pierwsze 15" : ""}</FormHelperText>
                </FormControl>

                {/* Dietary */}
                <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Ograniczenia dietetyczne</InputLabel>
                    <Select
                        multiple
                        value={selected.dietary}
                        label="Ograniczenia dietetyczne"
                        renderValue={selected => (
                            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                                {(selected as string[]).map(value => (
                                    <Chip key={value} label={value} size="small" color="primary" />
                                ))}
                            </Box>
                        )}
                        onChange={e => handleChange("dietary", e.target.value as string[])}
                    >
                        {options.dietaryRestrictions.map(opt => (
                            <MenuItem key={opt} value={opt}>
                                {opt}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {/* Product */}
                <Autocomplete
                    fullWidth
                    sx={{ mb: 3 }}
                    freeSolo
                    options={options.products.slice(0, 50)}
                    value={selected.product}
                    onChange={(_, newValue) => handleChange("product", newValue || "")}
                    renderInput={params => <TextField {...params} label="Produkt" placeholder="Wpisz lub wybierz produkt..." onKeyDown={e => e.stopPropagation()} />}
                />

                {/* Buttons */}
                <Box sx={{ display: "flex", gap: 1, justifyContent: "space-between" }}>
                    <Box sx={{ display: "flex", gap: 1 }}>
                        <Button variant="outlined" onClick={clearFilters} size="small" aria-label="Clear filters">
                            Wyczyść
                        </Button>
                        <Button variant="contained" onClick={applyFilters} size="small" aria-label="Apply filters">
                            Zastosuj
                        </Button>
                    </Box>
                    {onClose && (
                        <Button variant="outlined" onClick={onClose} size="small" aria-label="Close">
                            Zamknij
                        </Button>
                    )}
                </Box>
            </Box>
        </React.Fragment>
    );
}
