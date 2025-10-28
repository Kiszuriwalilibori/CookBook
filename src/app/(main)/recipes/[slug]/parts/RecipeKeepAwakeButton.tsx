
"use client";

import React, { useState, useEffect } from "react";
import { Box, Autocomplete, TextField, Button, Typography, Divider } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { fieldTranslations } from "@/lib/types";

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
    const theme = useTheme();
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
            const normalizedCuisines = [...new Set(cuisines.map(c => c.toLowerCase()))].sort((a, b) => a.localeCompare(b, "pl"));
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
            const normalizedDietary = [...new Set(dietary.map(d => d.toLowerCase()))].sort((a, b) => a.localeCompare(b, "pl"));
            const normalizedProducts = [...new Set(products.map(p => p.toLowerCase()))].sort((a, b) => a.localeCompare(b, "pl"));
            setOptions({ cuisines: normalizedCuisines, tags: processedTags, dietaryRestrictions: normalizedDietary, products: normalizedProducts });
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

    const surfaceMain = theme.palette.surface.main;
    const contrastText = theme.palette.getContrastText(surfaceMain);

    const dietaryOptions = React.useMemo(() => {
        const opts = ["Bez ograniczeń", ...options.dietaryRestrictions];
        return opts.sort((a, b) => {
            if (a === "Bez ograniczeń") return -1;
            if (b === "Bez ograniczeń") return 1;
            return a.localeCompare(b, "pl");
        });
    }, [options.dietaryRestrictions]);

    return (
        <React.Fragment>
            <Box sx={{ maxWidth: 400, width: "100%" }}>
                <Typography variant="h6" gutterBottom align="center">
                    Filtruj Przepisy
                </Typography>
                <Divider sx={{ mb: 2, borderColor: surfaceMain }} />

                {/* Cuisine */}
                <Autocomplete
                    fullWidth
                    sx={{ mb: 2 }}
                    options={["", ...options.cuisines]}
                    value={selected.cuisine}
                    onChange={(_, newValue) => handleChange("cuisine", newValue || "")}
                    getOptionLabel={option => (option === "" ? "Wszystkie" : option)}
                    renderInput={params => (
                        <TextField
                            {...params}
                            label={fieldTranslations.cuisine}
                            placeholder={`Wpisz lub wybierz ${fieldTranslations.cuisine.toLowerCase()}...`}
                            sx={{
                                "& .MuiInputLabel-root": {
                                    color: surfaceMain,
                                },
                                "& .MuiOutlinedInput-root": {
                                    "& fieldset": {
                                        borderColor: surfaceMain,
                                    },
                                    "&:hover fieldset": {
                                        borderColor: surfaceMain,
                                    },
                                    "&.Mui-focused fieldset": {
                                        borderColor: surfaceMain,
                                        borderWidth: 2,
                                    },
                                },
                                "& .MuiAutocomplete-endAdornment": {
                                    "& svg": {
                                        color: surfaceMain,
                                    },
                                },
                            }}
                        />
                    )}
                />

                {/* Tags */}
                <Autocomplete
                    fullWidth
                    sx={{ mb: 2 }}
                    multiple
                    options={options.tags}
                    value={selected.tag}
                    onChange={(_, newValue) => handleChange("tag", newValue || [])}
                    ChipProps={{
                        // Changed from slotProps.tag to ChipProps
                        sx: {
                            backgroundColor: surfaceMain,
                            color: contrastText,
                            "& .MuiChip-deleteIcon": {
                                color: contrastText,
                                "&:hover": {
                                    backgroundColor: `${contrastText}20`,
                                },
                            },
                        },
                    }}
                    
                    renderInput={params => (
                        <TextField
                            {...params}
                            label={fieldTranslations.tags}
                            placeholder={`Wpisz aby wyszukać ${fieldTranslations.tags.toLowerCase()}...`}
                            sx={{
                                "& .MuiInputLabel-root": {
                                    color: surfaceMain,
                                },
                                "& .MuiOutlinedInput-root": {
                                    "& fieldset": {
                                        borderColor: surfaceMain,
                                    },
                                    "&:hover fieldset": {
                                        borderColor: surfaceMain,
                                    },
                                    "&.Mui-focused fieldset": {
                                        borderColor: surfaceMain,
                                        borderWidth: 2,
                                    },
                                },
                                "& .MuiAutocomplete-endAdornment": {
                                    "& svg": {
                                        color: surfaceMain,
                                    },
                                },
                            }}
                        />
                    )}
                />

                {/* Dietary */}
                <Autocomplete
                    fullWidth
                    sx={{ mb: 2 }}
                    options={dietaryOptions}
                    value={selected.dietary.length === 0 ? "Bez ograniczeń" : selected.dietary[0] || "Bez ograniczeń"}
                    onChange={(_, newValue) => {
                        const val = newValue === "Bez ograniczeń" ? [] : newValue ? [newValue] : [];
                        handleChange("dietary", val);
                    }}
                    getOptionLabel={option => option}
                    renderInput={params => (
                        <TextField
                            {...params}
                            label={fieldTranslations.dietaryRestrictions}
                            placeholder={`Wpisz lub wybierz ${fieldTranslations.dietaryRestrictions.toLowerCase()}...`}
                            sx={{
                                "& .MuiInputLabel-root": {
                                    color: surfaceMain,
                                },
                                "& .MuiOutlinedInput-root": {
                                    "& fieldset": {
                                        borderColor: surfaceMain,
                                    },
                                    "&:hover fieldset": {
                                        borderColor: surfaceMain,
                                    },
                                    "&.Mui-focused fieldset": {
                                        borderColor: surfaceMain,
                                        borderWidth: 2,
                                    },
                                },
                                "& .MuiAutocomplete-endAdornment": {
                                    "& svg": {
                                        color: surfaceMain,
                                    },
                                },
                            }}
                        />
                    )}
                />

                {/* Product */}
                <Autocomplete
                    fullWidth
                    disableClearable
                    sx={{ mb: 2 }}
                    options={["", ...options.products.slice(0, 50)]}
                    value={selected.product}
                    onChange={(_, newValue) => handleChange("product", newValue || "")}
                    getOptionLabel={option => (option === "" ? "Wszystkie" : option)}
                    renderInput={params => (
                        <TextField
                            {...params}
                            label="Produkt"
                            placeholder="Wpisz aby wyszukać produkt..."
                            sx={{
                                "& .MuiInputLabel-root": {
                                    color: surfaceMain,
                                },
                                "& .MuiOutlinedInput-root": {
                                    "& fieldset": {
                                        borderColor: surfaceMain,
                                    },
                                    "&:hover fieldset": {
                                        borderColor: surfaceMain,
                                    },
                                    "&.Mui-focused fieldset": {
                                        borderColor: surfaceMain,
                                        borderWidth: 2,
                                    },
                                },
                                "& .MuiAutocomplete-endAdornment": {
                                    "& svg": {
                                        color: surfaceMain,
                                    },
                                },
                            }}
                        />
                    )}
                />

                {/* Buttons */}
                <Box sx={{ display: "flex", gap: 1, justifyContent: "center", flexWrap: "wrap" }}>
                    <Button
                        variant="outlined"
                        onClick={clearFilters}
                        size="small"
                        aria-label="Clear filters"
                        sx={{
                            borderColor: surfaceMain,
                            color: surfaceMain,
                            "&:hover": {
                                borderColor: surfaceMain,
                                backgroundColor: `${surfaceMain}10`,
                            },
                        }}
                    >
                        Wyczyść
                    </Button>
                    <Button
                        variant="contained"
                        onClick={applyFilters}
                        size="small"
                        aria-label="Apply filters"
                        sx={{
                            backgroundColor: surfaceMain,
                            color: contrastText,
                            "&:hover": {
                                backgroundColor: theme.palette.surface.dark,
                            },
                        }}
                    >
                        Zastosuj
                    </Button>
                    {onClose && (
                        <Button
                            variant="outlined"
                            onClick={onClose}
                            size="small"
                            aria-label="Close"
                            sx={{
                                borderColor: surfaceMain,
                                color: surfaceMain,
                                "&:hover": {
                                    borderColor: surfaceMain,
                                    backgroundColor: `${surfaceMain}10`,
                                },
                            }}
                        >
                            Zamknij
                        </Button>
                    )}
                </Box>
            </Box>
        </React.Fragment>
    );
}
