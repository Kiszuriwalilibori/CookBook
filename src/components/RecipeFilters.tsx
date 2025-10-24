"use client";

import React, { useState, useEffect } from "react";
import { Box, FormControl, InputLabel, Select, MenuItem, Chip, Autocomplete, TextField, FormHelperText, Button, Typography, Divider } from "@mui/material";

interface FilterState {
    cuisine: string;
    tag: string;
    dietary: string[];
    ingredient: string;
}

interface OptionsState {
    cuisines: string[];
    tags: string[];
    dietaryRestrictions: string[];
    ingredients: string[];
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
        ingredients: [],
    });
    const [selected, setSelected] = useState<FilterState>({
        cuisine: "",
        tag: "",
        dietary: [],
        ingredient: "",
    });

    useEffect(() => {
        Promise.all([
            fetch("/api/uniques/cuisine").then(r => r.json()) as Promise<string[]>,
            fetch("/api/uniques/tags").then(r => r.json()) as Promise<string[]>,
            fetch("/api/uniques/dietaryRestrictions").then(r => r.json()) as Promise<string[]>,
            fetch("/api/uniques/ingredients").then(r => r.json()) as Promise<string[]>,
        ]).then(([cuisines, tags, dietary, ingredients]) => {
            setOptions({ cuisines, tags, dietaryRestrictions: dietary, ingredients });
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
        const cleared = { cuisine: "", tag: "", dietary: [], ingredient: "" };
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

                {/* Tag */}
                <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Tag</InputLabel>
                    <Select value={selected.tag} label="Tag" onChange={e => handleChange("tag", e.target.value as string)}>
                        <MenuItem value="">
                            <em>Wszystkie</em>
                        </MenuItem>
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

                {/* Ingredient */}
                <Autocomplete
                    fullWidth
                    sx={{ mb: 3 }}
                    freeSolo
                    options={options.ingredients.slice(0, 50)}
                    value={selected.ingredient}
                    onChange={(_, newValue) => handleChange("ingredient", newValue || "")}
                    renderInput={params => <TextField {...params} label="Składnik" placeholder="Wpisz lub wybierz składnik..." onKeyDown={e => e.stopPropagation()} />}
                />

                {/* Buttons */}
                <Box sx={{ display: "flex", gap: 1, justifyContent: "space-between" }}>
                    <Box sx={{ display: "flex", gap: 1 }}>
                        <Button variant="outlined" onClick={clearFilters} size="small" aria-label="Clear filters">Wyczyść</Button>
                        <Button variant="contained" onClick={applyFilters} size="small" aria-label="Apply filters">Zastosuj</Button>
                    </Box>
                    {onClose && (
                        <Button variant="outlined" onClick={onClose} size="small" aria-label="Close">Zamknij</Button>
                    )}
                </Box>
            </Box>
        </React.Fragment>
    );
}
