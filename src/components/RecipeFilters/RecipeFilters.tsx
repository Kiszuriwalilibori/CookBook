// "use client";

// import React, { useCallback } from "react";
// import { Box, Button, Typography, Divider, Chip } from "@mui/material";
// import { useTheme } from "@mui/material/styles";
// import { fieldTranslations } from "@/lib/types";

// import { containerSx, fieldBoxSx, buttonGroupSx, chipContainerSx, chipSx, hiddenChipSx, dividerSx } from "./styles";
// import { FilterSummary, FilterAutocomplete } from "./parts";
// import { FilterState } from "@/types";
// import { useDietaryOptions, useFilters } from "@/hooks";
// import { Options } from "@/types";
// import { useFiltersStore, useRecipesStore } from "@/stores";

// const MAX_VISIBLE_CHIPS = 3;
// const MAX_PRODUCTS_DISPLAYED = 50;
// const NO_DIETARY_RESTRICTIONS_LABEL = "Bez ograniczeń";

// interface RecipeFiltersProps {
//     onFiltersChange: (filters: FilterState) => void;
//     onClose?: () => void;
//     options: Options;
// }

// export default function RecipeFilters({ onFiltersChange, onClose, options }: RecipeFiltersProps) {
//     const theme = useTheme();
//     const { filters, errors, handleChange, clear, apply } = useFilters(options, onFiltersChange);
//     const { setFilters } = useFiltersStore();

//     const dietaryOptions = useDietaryOptions({
//         dietaryRestrictions: options.dietaryRestrictions,
//         noRestrictionsLabel: NO_DIETARY_RESTRICTIONS_LABEL,
//     });
//     const { fetchFilteredRecipes } = useRecipesStore();

//     const renderLimitedChips = useCallback(
//         (value: readonly string[], key: "tag" | "product" | "dietary") => {
//             const items = [...value];
//             const visibleChips = items.slice(0, MAX_VISIBLE_CHIPS);
//             const hiddenCount = Math.max(0, items.length - MAX_VISIBLE_CHIPS);

//             return (
//                 <Box
//                     sx={{
//                         ...chipContainerSx,
//                         overflowY: items.length > MAX_VISIBLE_CHIPS ? "auto" : "visible",
//                     }}
//                 >
//                     {visibleChips.map(option => (
//                         <Chip
//                             key={option}
//                             label={option}
//                             onDelete={() =>
//                                 handleChange(
//                                     key as "tag" | "dietary" | "product",
//                                     items.filter(v => v !== option)
//                                 )
//                             }
//                             sx={chipSx(theme)}
//                             aria-label={`Usuń filtr: ${option}`}
//                         />
//                     ))}
//                     {hiddenCount > 0 && <Chip label={`+${hiddenCount} więcej`} sx={hiddenChipSx(theme)} />}
//                 </Box>
//             );
//         },
//         [theme, handleChange]
//     );

//     const handleApply = useCallback(() => {
//         const success = apply();
//         if (success) {
//             fetchFilteredRecipes(filters); // Only update global store after user explicitly applies filters
//             setFilters(filters);
//             onClose?.();
//         }
//     }, [apply, onClose, setFilters, fetchFilteredRecipes, filters]);

//     const handleClear = useCallback(() => {
//         clear();
//         // Reset global store when user explicitly clears filters
//         setFilters({} as FilterState);
//     }, [clear, setFilters]);

//     const getErrorProps = useCallback(
//         (key: keyof FilterState) => ({
//             error: !!errors[key],
//             helperText: errors[key],
//         }),
//         [errors]
//     );

//     return (
//         <Box sx={containerSx}>
//             <Typography variant="h6" gutterBottom align="center">
//                 Filtruj Przepisy
//             </Typography>
//             <Divider sx={dividerSx} />

//             <Box sx={fieldBoxSx}>
//                 <FilterAutocomplete label={fieldTranslations.title} options={options.titles} value={filters.title} onChange={v => handleChange("title", (v ?? "") as string)} {...getErrorProps("title")} />
//             </Box>

//             <Box sx={fieldBoxSx}>
//                 <FilterAutocomplete label={fieldTranslations.cuisine} options={options.cuisines} value={filters.cuisine} onChange={v => handleChange("cuisine", (v ?? "") as string)} {...getErrorProps("cuisine")} />
//             </Box>

//             <Box sx={fieldBoxSx}>
//                 <FilterAutocomplete label={fieldTranslations.tags} options={options.tags} value={filters.tag} multiple onChange={v => handleChange("tag", (v ?? []) as string[])} renderTags={value => renderLimitedChips(value, "tag")} {...getErrorProps("tag")} />
//             </Box>

//             <Box sx={fieldBoxSx}>
//                 <FilterAutocomplete
//                     label={fieldTranslations.dietaryRestrictions}
//                     options={dietaryOptions.filter(opt => opt !== NO_DIETARY_RESTRICTIONS_LABEL)}
//                     value={filters.dietary}
//                     multiple
//                     placeholder={NO_DIETARY_RESTRICTIONS_LABEL}
//                     onChange={v => handleChange("dietary", (v ?? []) as string[])}
//                     renderTags={value => renderLimitedChips(value, "dietary")}
//                     {...getErrorProps("dietary")}
//                 />
//             </Box>

//             <Box sx={fieldBoxSx}>
//                 <FilterAutocomplete
//                     label="Produkt"
//                     options={options.products.slice(0, MAX_PRODUCTS_DISPLAYED).sort((a, b) => a.localeCompare(b, "pl"))}
//                     value={filters.product}
//                     multiple
//                     onChange={v => handleChange("product", (v ?? []) as string[])}
//                     renderTags={value => renderLimitedChips(value, "product")}
//                     {...getErrorProps("product")}
//                 />
//             </Box>

//             <Box sx={buttonGroupSx}>
//                 <Button variant="outlined" color="primary" onClick={handleClear} size="small">
//                     Wyczyść
//                 </Button>
//                 <Button variant="contained" color="primary" onClick={handleApply} size="small">
//                     Zastosuj
//                 </Button>
//                 {onClose && (
//                     <Button variant="outlined" color="primary" onClick={onClose} size="small">
//                         Zamknij
//                     </Button>
//                 )}
//             </Box>
//             <FilterSummary filters={filters} />
//         </Box>
//     );
// }

"use client";

import React, { useCallback, useMemo } from "react";
import { Box, Button, Typography, Divider, Chip } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { fieldTranslations } from "@/lib/types";
import { containerSx, fieldBoxSx, buttonGroupSx, chipSx, hiddenChipSx, dividerSx, limitedChipBoxSx } from "./styles";
import { FilterSummary, FilterAutocomplete } from "./parts";
import { FilterState, Options } from "@/types";
import { useDietaryOptions, useFilters } from "@/hooks";
import { useFiltersStore, useRecipesStore } from "@/stores";

const MAX_VISIBLE_CHIPS = 3;
const MAX_PRODUCTS_DISPLAYED = 50;
const NO_DIETARY_RESTRICTIONS_LABEL = "Bez ograniczeń";

// 🧩 Static base filter configuration
const BASE_FILTER_FIELDS = [
    { key: "title", label: fieldTranslations.title, multiple: false },
    { key: "cuisine", label: fieldTranslations.cuisine, multiple: false },
    { key: "tag", label: fieldTranslations.tags, multiple: true, chips: true },
    { key: "dietary", label: fieldTranslations.dietaryRestrictions, multiple: true, chips: true },
    { key: "product", label: "Produkt", multiple: true, chips: true },
] as const;

interface FilterField {
    key: keyof FilterState;
    label: string;
    multiple: boolean;
    chips?: boolean;
    options: string[];
    placeholder?: string;
}

type ChipFieldKey = "tag" | "product" | "dietary";

interface RecipeFiltersProps {
    onFiltersChange: (filters: FilterState) => void;
    onClose?: () => void;
    options: Options;
}

export default function RecipeFilters({ onFiltersChange, onClose, options }: RecipeFiltersProps) {
    const theme = useTheme();
    const { filters, errors, handleChange, clear, apply } = useFilters(options, onFiltersChange);
    const { setFilters } = useFiltersStore();
    const { fetchFilteredRecipes } = useRecipesStore();

    // 🧠 Derived data
    const dietaryOptions = useDietaryOptions({
        dietaryRestrictions: options.dietaryRestrictions,
        noRestrictionsLabel: NO_DIETARY_RESTRICTIONS_LABEL,
    });

    const productOptions = useMemo(() => options.products.slice(0, MAX_PRODUCTS_DISPLAYED).sort((a, b) => a.localeCompare(b, "pl")), [options.products]);

    // ♻️ Shared chip rendering
    const renderLimitedChips = useCallback(
        (value: readonly string[], key: ChipFieldKey) => {
            const visible = value.slice(0, MAX_VISIBLE_CHIPS);
            const hidden = value.length - visible.length;

            return (
                <Box sx={limitedChipBoxSx(value.length > MAX_VISIBLE_CHIPS)}>
                    {visible.map(option => (
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
                            aria-label={`Usuń filtr: ${option}`}
                        />
                    ))}
                    {hidden > 0 && <Chip label={`+${hidden} więcej`} sx={hiddenChipSx(theme)} />}
                </Box>
            );
        },
        [theme, handleChange]
    );

    const handleApply = useCallback(() => {
        if (apply()) {
            fetchFilteredRecipes(filters);
            setFilters(filters);
            onClose?.();
        }
    }, [apply, filters, fetchFilteredRecipes, setFilters, onClose]);

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

    // 🧩 Build full filter field definitions (attach dynamic options)
    const filterFields: FilterField[] = useMemo(
        () =>
            BASE_FILTER_FIELDS.map(base => ({
                ...base,
                options: base.key === "dietary" ? dietaryOptions.filter(o => o !== NO_DIETARY_RESTRICTIONS_LABEL) : base.key === "product" ? productOptions : options[`${base.key}s` as keyof Options],
                placeholder: base.key === "dietary" ? NO_DIETARY_RESTRICTIONS_LABEL : undefined,
            })),
        [options, dietaryOptions, productOptions]
    );

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
                        multiple={field.multiple}
                        placeholder={field.placeholder}
                        value={filters[field.key as keyof FilterState]}
                        onChange={(newValue: string | string[] | null) => {
                            const normalizedValue = newValue ?? (field.multiple ? [] : "");
                            handleChange(field.key, normalizedValue);
                        }}
                        renderTags={field.chips && ["tag", "product", "dietary"].includes(field.key) ? value => renderLimitedChips(value, field.key as ChipFieldKey) : undefined}
                        {...getErrorProps(field.key)}
                    />
                </Box>
            ))}

            <Box sx={buttonGroupSx}>
                <Button variant="outlined" onClick={handleClear} size="small">
                    Wyczyść
                </Button>
                <Button variant="contained" onClick={handleApply} size="small">
                    Zastosuj
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
