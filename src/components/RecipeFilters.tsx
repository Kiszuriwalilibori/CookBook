// // "use client";

// // import React, { useState, useEffect } from "react";
// // import { Box, Autocomplete, TextField, Button, Typography, Divider } from "@mui/material";
// // import { useTheme } from "@mui/material/styles";
// // import { fieldTranslations } from "@/lib/types";

// // interface FilterState {
// //     title: string;
// //     cuisine: string;
// //     tag: string[];
// //     dietary: string[];
// //     product: string[];
// // }

// // interface OptionsState {
// //     titles: string[];
// //     cuisines: string[];
// //     tags: string[];
// //     dietaryRestrictions: string[];
// //     products: string[];
// // }

// // interface RecipeFiltersProps {
// //     onFiltersChange: (filters: FilterState) => void;
// //     onClose?: () => void; // Explicit optional with ?
// // }

// // export default function RecipeFilters({ onFiltersChange, onClose }: RecipeFiltersProps) {
// //     const theme = useTheme();
// //     const [options, setOptions] = useState<OptionsState>({
// //         titles: [],
// //         cuisines: [],
// //         tags: [],
// //         dietaryRestrictions: [],
// //         products: [],
// //     });
// //     const [selected, setSelected] = useState<FilterState>({
// //         title: "",
// //         cuisine: "",
// //         tag: [],
// //         dietary: [],
// //         product: [],
// //     });

// //     useEffect(() => {
// //         Promise.all([
// //             fetch("/api/uniques/title").then(r => r.json()) as Promise<string[]>,
// //             fetch("/api/uniques/cuisine").then(r => r.json()) as Promise<string[]>,
// //             fetch("/api/uniques/tags").then(r => r.json()) as Promise<string[]>,
// //             fetch("/api/uniques/dietaryRestrictions").then(r => r.json()) as Promise<string[]>,
// //             fetch("/api/uniques/products").then(r => r.json()) as Promise<string[]>,
// //         ]).then(([titles, cuisines, tags, dietary, products]) => {
// //             const normalizedTitles = [...new Set(titles.map(t => t.toLowerCase()))].sort((a, b) => a.localeCompare(b, "pl"));
// //             const normalizedCuisines = [...new Set(cuisines.map(c => c.toLowerCase()))].sort((a, b) => a.localeCompare(b, "pl"));
// //             const processedTags = Array.from(
// //                 new Set(
// //                     tags.flatMap(tag =>
// //                         tag
// //                             .split(",")
// //                             .map(t => t.trim().toLowerCase())
// //                             .filter(Boolean)
// //                     )
// //                 )
// //             ).sort((a, b) => a.localeCompare(b, "pl"));
// //             const normalizedDietary = [...new Set(dietary.map(d => d.toLowerCase()))].sort((a, b) => a.localeCompare(b, "pl"));
// //             const normalizedProducts = [...new Set(products.map(p => p.toLowerCase()))].sort((a, b) => a.localeCompare(b, "pl"));
// //             setOptions({ titles: normalizedTitles, cuisines: normalizedCuisines, tags: processedTags, dietaryRestrictions: normalizedDietary, products: normalizedProducts });
// //         });
// //     }, []);

// //     const handleChange = (key: keyof FilterState, value: string | string[]) => {
// //         setSelected(prev => ({ ...prev, [key]: value }));
// //     };

// //     const applyFilters = () => {
// //         onFiltersChange(selected);
// //         onClose?.(); // Optional auto-close on apply
// //     };

// //     const clearFilters = () => {
// //         const cleared = { title: "", cuisine: "", tag: [], dietary: [], product: [] };
// //         setSelected(cleared);
// //         onFiltersChange(cleared);
// //     };

// //     const surfaceMain = theme.palette.surface.main;

// //     const dietaryOptions = React.useMemo(() => {
// //         const opts = ["Bez ograniczeń", ...options.dietaryRestrictions];
// //         return opts.sort((a, b) => {
// //             if (a === "Bez ograniczeń") return -1;
// //             if (b === "Bez ograniczeń") return 1;
// //             return a.localeCompare(b, "pl");
// //         });
// //     }, [options.dietaryRestrictions]);

// //     const labelSx = {
// //         "& .MuiInputLabel-root": {
// //             color: surfaceMain,
// //         },
// //         "& .MuiInputLabel-root.MuiInputLabel-shrink": {
// //             color: surfaceMain,
// //         },
// //         "& .MuiInputLabel-root.Mui-focused": {
// //             color: surfaceMain,
// //         },
// //         "& .MuiOutlinedInput-root": {
// //             "& fieldset": {
// //                 borderColor: surfaceMain,
// //             },
// //             "&:hover fieldset": {
// //                 borderColor: surfaceMain,
// //             },
// //             "&.Mui-focused fieldset": {
// //                 borderColor: surfaceMain,
// //                 borderWidth: 2,
// //             },
// //         },
// //         "& .MuiAutocomplete-endAdornment": {
// //             "& svg": {
// //                 color: surfaceMain,
// //             },
// //         },
// //         "& .MuiInputBase-input": {
// //             "&::placeholder": {
// //                 color: theme.palette.text.disabled,
// //                 opacity: 1,
// //             },
// //         },
// //     };

// //     return (
// //         <React.Fragment>
// //             <Box sx={{ maxWidth: 400, width: "100%" }}>
// //                 <Typography variant="h6" gutterBottom align="center">
// //                     Filtruj Przepisy
// //                 </Typography>
// //                 <Divider sx={{ mb: 2, borderColor: surfaceMain }} />

// //                 {/* Title */}
// //                 <Autocomplete
// //                     fullWidth
// //                     sx={{ mb: 2 }}
// //                     options={["", ...options.titles]}
// //                     value={selected.title}
// //                     onChange={(_, newValue) => handleChange("title", newValue || "")}
// //                     getOptionLabel={option => (option === "" ? "Wszystkie" : option)}
// //                     renderInput={params => <TextField {...params} label={fieldTranslations.title} placeholder="Wszystkie" InputLabelProps={{ shrink: true }} sx={labelSx} />}
// //                 />

// //                 {/* Cuisine */}
// //                 <Autocomplete
// //                     fullWidth
// //                     sx={{ mb: 2 }}
// //                     options={options.cuisines}
// //                     value={selected.cuisine || null}
// //                     onChange={(_, newValue) => handleChange("cuisine", newValue || "")}
// //                     renderInput={params => <TextField {...params} label={fieldTranslations.cuisine} placeholder="Wszystkie" InputLabelProps={{ shrink: true }} sx={labelSx} />}
// //                 />

// //                 {/* Tags */}
// //                 <Autocomplete
// //                     fullWidth
// //                     sx={{ mb: 2 }}
// //                     multiple
// //                     options={options.tags}
// //                     value={selected.tag}
// //                     onChange={(_, newValue) => handleChange("tag", newValue || [])}
// //                     slotProps={{
// //                         chip: {
// //                             sx: {
// //                                 backgroundColor: theme.palette.surface.light,
// //                                 color: "white",
// //                                 "& .MuiChip-deleteIcon": {
// //                                     color: "white",
// //                                     "&:hover": {
// //                                         backgroundColor: "rgba(255, 255, 255, 0.2)",
// //                                     },
// //                                 },
// //                             },
// //                         },
// //                     }}
// //                     renderInput={params => <TextField {...params} label={fieldTranslations.tags} placeholder="Wszystkie" InputLabelProps={{ shrink: true }} sx={labelSx} />}
// //                 />

// //                 {/* Dietary */}
// //                 <Autocomplete
// //                     fullWidth
// //                     sx={{ mb: 2 }}
// //                     options={dietaryOptions}
// //                     value={selected.dietary.length === 0 ? null : selected.dietary[0]}
// //                     onChange={(_, newValue) => {
// //                         const val = newValue === "Bez ograniczeń" ? [] : newValue ? [newValue] : [];
// //                         handleChange("dietary", val);
// //                     }}
// //                     getOptionLabel={option => option}
// //                     renderInput={params => <TextField {...params} label={fieldTranslations.dietaryRestrictions} placeholder="Bez ograniczeń" InputLabelProps={{ shrink: true }} sx={labelSx} />}
// //                 />

// //                 {/* Product */}
// //                 <Autocomplete
// //                     fullWidth
// //                     multiple
// //                     sx={{ mb: 2 }}
// //                     options={options.products.slice(0, 50)}
// //                     value={selected.product}
// //                     onChange={(_, newValue) => handleChange("product", newValue || [])}
// //                     slotProps={{
// //                         chip: {
// //                             sx: {
// //                                 backgroundColor: theme.palette.surface.light,
// //                                 color: "white",
// //                                 "& .MuiChip-deleteIcon": {
// //                                     color: "white",
// //                                     "&:hover": {
// //                                         backgroundColor: "rgba(255, 255, 255, 0.2)",
// //                                     },
// //                                 },
// //                             },
// //                         },
// //                     }}
// //                     renderInput={params => <TextField {...params} label="Produkt" placeholder="Wszystkie" InputLabelProps={{ shrink: true }} sx={labelSx} />}
// //                 />

// //                 {/* Buttons */}
// //                 <Box sx={{ display: "flex", gap: 1, justifyContent: "center", flexWrap: "wrap" }}>
// //                     <Button
// //                         variant="outlined"
// //                         onClick={clearFilters}
// //                         size="small"
// //                         aria-label="Clear filters"
// //                         sx={{
// //                             borderColor: surfaceMain,
// //                             color: surfaceMain,
// //                             "&:hover": {
// //                                 borderColor: surfaceMain,
// //                                 backgroundColor: `${surfaceMain}10`,
// //                             },
// //                         }}
// //                     >
// //                         Wyczyść
// //                     </Button>
// //                     <Button
// //                         variant="contained"
// //                         onClick={applyFilters}
// //                         size="small"
// //                         aria-label="Apply filters"
// //                         sx={{
// //                             backgroundColor: surfaceMain,
// //                             "&:hover": {
// //                                 backgroundColor: theme.palette.surface.dark,
// //                             },
// //                         }}
// //                     >
// //                         Zastosuj
// //                     </Button>
// //                     {onClose && (
// //                         <Button
// //                             variant="outlined"
// //                             onClick={onClose}
// //                             size="small"
// //                             aria-label="Close"
// //                             sx={{
// //                                 borderColor: surfaceMain,
// //                                 color: surfaceMain,
// //                                 "&:hover": {
// //                                     borderColor: surfaceMain,
// //                                     backgroundColor: `${surfaceMain}10`,
// //                                 },
// //                             }}
// //                         >
// //                             Zamknij
// //                         </Button>
// //                     )}
// //                 </Box>
// //             </Box>
// //         </React.Fragment>
// //     );
// // }
// "use client";

// import React, { useState, useEffect, useMemo } from "react";
// import { Box, Autocomplete, TextField, Button, Typography, Divider } from "@mui/material";
// import { useTheme } from "@mui/material/styles";
// import { fieldTranslations } from "@/lib/types";
// import debounce from "lodash.debounce";

// interface FilterState {
//     title: string;
//     cuisine: string;
//     tag: string[];
//     dietary: string[];
//     product: string[];
// }

// interface OptionsState {
//     titles: string[];
//     cuisines: string[];
//     tags: string[];
//     dietaryRestrictions: string[];
//     products: string[];
// }

// interface RecipeFiltersProps {
//     onFiltersChange: (filters: FilterState) => void;
//     onClose?: () => void; // Explicit optional with ?
// }

// export default function RecipeFilters({ onFiltersChange, onClose }: RecipeFiltersProps) {
//     const theme = useTheme();
//     const [options, setOptions] = useState<OptionsState>({
//         titles: [],
//         cuisines: [],
//         tags: [],
//         dietaryRestrictions: [],
//         products: [],
//     });
//     const [selected, setSelected] = useState<FilterState>({
//         title: "",
//         cuisine: "",
//         tag: [],
//         dietary: [],
//         product: [],
//     });

//     const debouncedApplyFilters = useMemo(
//         () =>
//             debounce((newFilters: FilterState) => {
//                 onFiltersChange(newFilters);
//             }, 500), // 500ms debounce delay
//         [onFiltersChange]
//     );

//     useEffect(() => {
//         return () => {
//             debouncedApplyFilters.cancel();
//         };
//     }, [debouncedApplyFilters]);
//     const handleChange = (key: keyof FilterState, value: string | string[]) => {
//         setSelected(prev => {
//             const updated = { ...prev, [key]: value };
//             debouncedApplyFilters(updated);
//             return updated;
//         });
//     };

//     useEffect(() => {
//         Promise.all([
//             fetch("/api/uniques/title").then(r => r.json()) as Promise<string[]>,
//             fetch("/api/uniques/cuisine").then(r => r.json()) as Promise<string[]>,
//             fetch("/api/uniques/tags").then(r => r.json()) as Promise<string[]>,
//             fetch("/api/uniques/dietaryRestrictions").then(r => r.json()) as Promise<string[]>,
//             fetch("/api/uniques/products").then(r => r.json()) as Promise<string[]>,
//         ]).then(([titles, cuisines, tags, dietary, products]) => {
//             const normalizedTitles = [...new Set(titles.map(t => t.toLowerCase()))].sort((a, b) => a.localeCompare(b, "pl"));
//             const normalizedCuisines = [...new Set(cuisines.map(c => c.toLowerCase()))].sort((a, b) => a.localeCompare(b, "pl"));
//             const processedTags = Array.from(
//                 new Set(
//                     tags.flatMap(tag =>
//                         tag
//                             .split(",")
//                             .map(t => t.trim().toLowerCase())
//                             .filter(Boolean)
//                     )
//                 )
//             ).sort((a, b) => a.localeCompare(b, "pl"));
//             const normalizedDietary = [...new Set(dietary.map(d => d.toLowerCase()))].sort((a, b) => a.localeCompare(b, "pl"));
//             const normalizedProducts = [...new Set(products.map(p => p.toLowerCase()))].sort((a, b) => a.localeCompare(b, "pl"));
//             setOptions({ titles: normalizedTitles, cuisines: normalizedCuisines, tags: processedTags, dietaryRestrictions: normalizedDietary, products: normalizedProducts });
//         });
//     }, []);

//     // const handleChange = (key: keyof FilterState, value: string | string[]) => {
//     //     setSelected(prev => {
//     //         const updatedFilters = { ...prev, [key]: value };
//     //         // Trigger debounced filter application on filter change
//     //         debouncedApplyFilters(updatedFilters);
//     //         return updatedFilters;
//     //     });
//     // };

//     const applyFilters = () => {
//         onFiltersChange(selected);
//         onClose?.(); // Optional auto-close on apply
//     };

//     const clearFilters = () => {
//         const cleared = { title: "", cuisine: "", tag: [], dietary: [], product: [] };
//         setSelected(cleared);
//         onFiltersChange(cleared);
//     };

//     const surfaceMain = theme.palette.surface.main;

//     const dietaryOptions = React.useMemo(() => {
//         const opts = ["Bez ograniczeń", ...options.dietaryRestrictions];
//         return opts.sort((a, b) => {
//             if (a === "Bez ograniczeń") return -1;
//             if (b === "Bez ograniczeń") return 1;
//             return a.localeCompare(b, "pl");
//         });
//     }, [options.dietaryRestrictions]);

//     const labelSx = {
//         "& .MuiInputLabel-root": {
//             color: surfaceMain,
//         },
//         "& .MuiInputLabel-root.MuiInputLabel-shrink": {
//             color: surfaceMain,
//         },
//         "& .MuiInputLabel-root.Mui-focused": {
//             color: surfaceMain,
//         },
//         "& .MuiOutlinedInput-root": {
//             "& fieldset": {
//                 borderColor: surfaceMain,
//             },
//             "&:hover fieldset": {
//                 borderColor: surfaceMain,
//             },
//             "&.Mui-focused fieldset": {
//                 borderColor: surfaceMain,
//                 borderWidth: 2,
//             },
//         },
//         "& .MuiAutocomplete-endAdornment": {
//             "& svg": {
//                 color: surfaceMain,
//             },
//         },
//         "& .MuiInputBase-input": {
//             "&::placeholder": {
//                 color: theme.palette.text.disabled,
//                 opacity: 1,
//             },
//         },
//     };

//     return (
//         <React.Fragment>
//             <Box sx={{ maxWidth: 400, width: "100%" }}>
//                 <Typography variant="h6" gutterBottom align="center">
//                     Filtruj Przepisy
//                 </Typography>
//                 <Divider sx={{ mb: 2, borderColor: surfaceMain }} />

//                 {/* Title */}
//                 <Autocomplete
//                     fullWidth
//                     sx={{ mb: 2 }}
//                     options={["", ...options.titles]}
//                     value={selected.title}
//                     onChange={(_, newValue) => handleChange("title", newValue || "")}
//                     getOptionLabel={option => (option === "" ? "Wszystkie" : option)}
//                     renderInput={params => <TextField {...params} label={fieldTranslations.title} placeholder="Wszystkie" InputLabelProps={{ shrink: true }} sx={labelSx} />}
//                 />

//                 {/* Cuisine */}
//                 <Autocomplete
//                     fullWidth
//                     sx={{ mb: 2 }}
//                     options={options.cuisines}
//                     value={selected.cuisine || null}
//                     onChange={(_, newValue) => handleChange("cuisine", newValue || "")}
//                     renderInput={params => <TextField {...params} label={fieldTranslations.cuisine} placeholder="Wszystkie" InputLabelProps={{ shrink: true }} sx={labelSx} />}
//                 />

//                 {/* Tags */}
//                 <Autocomplete
//                     fullWidth
//                     sx={{ mb: 2 }}
//                     multiple
//                     options={options.tags}
//                     value={selected.tag}
//                     onChange={(_, newValue) => handleChange("tag", newValue || [])}
//                     slotProps={{
//                         chip: {
//                             sx: {
//                                 backgroundColor: theme.palette.surface.light,
//                                 color: "white",
//                                 "& .MuiChip-deleteIcon": {
//                                     color: "white",
//                                     "&:hover": {
//                                         backgroundColor: "rgba(255, 255, 255, 0.2)",
//                                     },
//                                 },
//                             },
//                         },
//                     }}
//                     renderInput={params => <TextField {...params} label={fieldTranslations.tags} placeholder="Wszystkie" InputLabelProps={{ shrink: true }} sx={labelSx} />}
//                 />

//                 {/* Dietary */}
//                 <Autocomplete
//                     fullWidth
//                     sx={{ mb: 2 }}
//                     options={dietaryOptions}
//                     value={selected.dietary.length === 0 ? null : selected.dietary[0]}
//                     onChange={(_, newValue) => {
//                         const val = newValue === "Bez ograniczeń" ? [] : newValue ? [newValue] : [];
//                         handleChange("dietary", val);
//                     }}
//                     getOptionLabel={option => option}
//                     renderInput={params => <TextField {...params} label={fieldTranslations.dietaryRestrictions} placeholder="Bez ograniczeń" InputLabelProps={{ shrink: true }} sx={labelSx} />}
//                 />

//                 {/* Product */}
//                 <Autocomplete
//                     fullWidth
//                     multiple
//                     sx={{ mb: 2 }}
//                     options={options.products.slice(0, 50)}
//                     value={selected.product}
//                     onChange={(_, newValue) => handleChange("product", newValue || [])}
//                     slotProps={{
//                         chip: {
//                             sx: {
//                                 backgroundColor: theme.palette.surface.light,
//                                 color: "white",
//                                 "& .MuiChip-deleteIcon": {
//                                     color: "white",
//                                     "&:hover": {
//                                         backgroundColor: "rgba(255, 255, 255, 0.2)",
//                                     },
//                                 },
//                             },
//                         },
//                     }}
//                     renderInput={params => <TextField {...params} label="Produkt" placeholder="Wszystkie" InputLabelProps={{ shrink: true }} sx={labelSx} />}
//                 />

//                 {/* Buttons */}
//                 <Box sx={{ display: "flex", gap: 1, justifyContent: "center", flexWrap: "wrap" }}>
//                     <Button
//                         variant="outlined"
//                         onClick={clearFilters}
//                         size="small"
//                         aria-label="Clear filters"
//                         sx={{
//                             borderColor: surfaceMain,
//                             color: surfaceMain,
//                             "&:hover": {
//                                 borderColor: surfaceMain,
//                                 backgroundColor: `${surfaceMain}10`,
//                             },
//                         }}
//                     >
//                         Wyczyść
//                     </Button>
//                     <Button
//                         variant="contained"
//                         onClick={applyFilters}
//                         size="small"
//                         aria-label="Apply filters"
//                         sx={{
//                             backgroundColor: surfaceMain,
//                             "&:hover": {
//                                 backgroundColor: theme.palette.surface.dark,
//                             },
//                         }}
//                     >
//                         Zastosuj
//                     </Button>
//                     {onClose && (
//                         <Button
//                             variant="outlined"
//                             onClick={onClose}
//                             size="small"
//                             aria-label="Close"
//                             sx={{
//                                 borderColor: surfaceMain,
//                                 color: surfaceMain,
//                                 "&:hover": {
//                                     borderColor: surfaceMain,
//                                     backgroundColor: `${surfaceMain}10`,
//                                 },
//                             }}
//                         >
//                             Zamknij
//                         </Button>
//                     )}
//                 </Box>
//             </Box>
//         </React.Fragment>
//     );
// }
// "use client";

// import React, { useState, useEffect } from "react";
// import { Box, Autocomplete, TextField, Button, Typography, Divider } from "@mui/material";
// import { useTheme } from "@mui/material/styles";
// import { fieldTranslations } from "@/lib/types";

// interface FilterState {
//     cuisine: string;
//     tag: string[];
//     dietary: string[];
//     product: string[];
//     title: string;
// }

// interface OptionsState {
//     cuisines: string[];
//     tags: string[];
//     dietaryRestrictions: string[];
//     products: string[];
//     titles: string[];
// }

// interface RecipeFiltersProps {
//     onFiltersChange: (filters: FilterState) => void;
//     onClose?: () => void; // Explicit optional with ?
// }

// export default function RecipeFilters({ onFiltersChange, onClose }: RecipeFiltersProps) {
//     const theme = useTheme();
//     const [options, setOptions] = useState<OptionsState>({
//         cuisines: [],
//         tags: [],
//         dietaryRestrictions: [],
//         products: [],
//         titles: [],
//     });
//     const [selected, setSelected] = useState<FilterState>({
//         cuisine: "",
//         tag: [],
//         dietary: [],
//         product: [],
//         title: "",
//     });

//     useEffect(() => {
//         Promise.all([
//             fetch("/api/uniques/cuisine").then(r => r.json()) as Promise<string[]>,
//             fetch("/api/uniques/tags").then(r => r.json()) as Promise<string[]>,
//             fetch("/api/uniques/dietaryRestrictions").then(r => r.json()) as Promise<string[]>,
//             fetch("/api/uniques/products").then(r => r.json()) as Promise<string[]>,
//             fetch("/api/uniques/title").then(r => r.json()) as Promise<string[]>,
//         ]).then(([cuisines, tags, dietary, products, titles]) => {
//             const normalizedCuisines = [...new Set(cuisines.map(c => c.toLowerCase()))].sort((a, b) => a.localeCompare(b, "pl"));
//             const processedTags = Array.from(
//                 new Set(
//                     tags.flatMap(tag =>
//                         tag
//                             .split(",")
//                             .map(t => t.trim().toLowerCase())
//                             .filter(Boolean)
//                     )
//                 )
//             ).sort((a, b) => a.localeCompare(b, "pl"));
//             const normalizedDietary = [...new Set(dietary.map(d => d.toLowerCase()))].sort((a, b) => a.localeCompare(b, "pl"));
//             const normalizedProducts = [...new Set(products.map(p => p.toLowerCase()))].sort((a, b) => a.localeCompare(b, "pl"));
//             const normalizedTitles = [...new Set(titles.map(t => t.toLowerCase()))].sort((a, b) => a.localeCompare(b, "pl"));
//             setOptions({ cuisines: normalizedCuisines, tags: processedTags, dietaryRestrictions: normalizedDietary, products: normalizedProducts, titles: normalizedTitles });
//         });
//     }, []);

//     const handleChange = (key: keyof FilterState, value: string | string[]) => {
//         setSelected(prev => ({ ...prev, [key]: value }));
//     };

//     const applyFilters = () => {
//         onFiltersChange(selected);
//         onClose?.(); // Optional auto-close on apply
//     };

//     const clearFilters = () => {
//         const cleared = { cuisine: "", tag: [], dietary: [], product: [], title: "" };
//         setSelected(cleared);
//         onFiltersChange(cleared);
//     };

//     const surfaceMain = theme.palette.surface.main;

//     const dietaryOptions = React.useMemo(() => {
//         const opts = ["Bez ograniczeń", ...options.dietaryRestrictions];
//         return opts.sort((a, b) => {
//             if (a === "Bez ograniczeń") return -1;
//             if (b === "Bez ograniczeń") return 1;
//             return a.localeCompare(b, "pl");
//         });
//     }, [options.dietaryRestrictions]);

//     const labelSx = {
//         "& .MuiInputLabel-root": {
//             color: surfaceMain,
//         },
//         "& .MuiInputLabel-root.MuiInputLabel-shrink": {
//             color: surfaceMain,
//         },
//         "& .MuiInputLabel-root.Mui-focused": {
//             color: surfaceMain,
//         },
//         "& .MuiOutlinedInput-root": {
//             "& fieldset": {
//                 borderColor: surfaceMain,
//             },
//             "&:hover fieldset": {
//                 borderColor: surfaceMain,
//             },
//             "&.Mui-focused fieldset": {
//                 borderColor: surfaceMain,
//                 borderWidth: 2,
//             },
//         },
//         "& .MuiAutocomplete-endAdornment": {
//             "& svg": {
//                 color: surfaceMain,
//             },
//         },
//         "& .MuiInputBase-input": {
//             "&::placeholder": {
//                 color: theme.palette.text.disabled,
//                 opacity: 1,
//             },
//         },
//     };

//     return (
//         <React.Fragment>
//             <Box sx={{ maxWidth: 400, width: "100%" }}>
//                 <Typography variant="h6" gutterBottom align="center">
//                     Filtruj Przepisy
//                 </Typography>
//                 <Divider sx={{ mb: 2, borderColor: surfaceMain }} />

//                 {/* Cuisine */}
//                 <Autocomplete
//                     fullWidth
//                     sx={{ mb: 2 }}
//                     options={options.cuisines}
//                     value={selected.cuisine || null}
//                     onChange={(_, newValue) => handleChange("cuisine", newValue || "")}
//                     renderInput={params => <TextField {...params} label={fieldTranslations.cuisine} placeholder="Wszystkie" InputLabelProps={{ shrink: true }} sx={labelSx} />}
//                 />

//                 {/* Tags */}
//                 <Autocomplete
//                     fullWidth
//                     sx={{ mb: 2 }}
//                     multiple
//                     options={options.tags}
//                     value={selected.tag}
//                     onChange={(_, newValue) => handleChange("tag", newValue || [])}
//                     slotProps={{
//                         chip: {
//                             sx: {
//                                 backgroundColor: theme.palette.surface.light,
//                                 color: "white",
//                                 "& .MuiChip-deleteIcon": {
//                                     color: "white",
//                                     "&:hover": {
//                                         backgroundColor: "rgba(255, 255, 255, 0.2)",
//                                     },
//                                 },
//                             },
//                         },
//                     }}
//                     renderInput={params => <TextField {...params} label={fieldTranslations.tags} placeholder="Wszystkie" InputLabelProps={{ shrink: true }} sx={labelSx} />}
//                 />

//                 {/* Dietary */}
//                 <Autocomplete
//                     fullWidth
//                     sx={{ mb: 2 }}
//                     options={dietaryOptions}
//                     value={selected.dietary.length === 0 ? null : selected.dietary[0]}
//                     onChange={(_, newValue) => {
//                         const val = newValue === "Bez ograniczeń" ? [] : newValue ? [newValue] : [];
//                         handleChange("dietary", val);
//                     }}
//                     getOptionLabel={option => option}
//                     renderInput={params => <TextField {...params} label={fieldTranslations.dietaryRestrictions} placeholder="Bez ograniczeń" InputLabelProps={{ shrink: true }} sx={labelSx} />}
//                 />

//                 {/* Product */}
//                 <Autocomplete
//                     fullWidth
//                     multiple
//                     sx={{ mb: 2 }}
//                     options={options.products.slice(0, 50)}
//                     value={selected.product}
//                     onChange={(_, newValue) => handleChange("product", newValue || [])}
//                     slotProps={{
//                         chip: {
//                             sx: {
//                                 backgroundColor: theme.palette.surface.light,
//                                 color: "white",
//                                 "& .MuiChip-deleteIcon": {
//                                     color: "white",
//                                     "&:hover": {
//                                         backgroundColor: "rgba(255, 255, 255, 0.2)",
//                                     },
//                                 },
//                             },
//                         },
//                     }}
//                     renderInput={params => <TextField {...params} label="Produkt" placeholder="Wszystkie" InputLabelProps={{ shrink: true }} sx={labelSx} />}
//                 />

//                 {/* Title */}
//                 <Autocomplete
//                     fullWidth
//                     sx={{ mb: 2 }}
//                     options={["", ...options.titles]}
//                     value={selected.title}
//                     onChange={(_, newValue) => handleChange("title", newValue || "")}
//                     getOptionLabel={option => (option === "" ? "Wszystkie" : option)}
//                     renderInput={params => <TextField {...params} label={fieldTranslations.title} placeholder="Wszystkie" InputLabelProps={{ shrink: true }} sx={labelSx} />}
//                 />

//                 {/* Buttons */}
//                 <Box sx={{ display: "flex", gap: 1, justifyContent: "center", flexWrap: "wrap" }}>
//                     <Button
//                         variant="outlined"
//                         onClick={clearFilters}
//                         size="small"
//                         aria-label="Clear filters"
//                         sx={{
//                             borderColor: surfaceMain,
//                             color: surfaceMain,
//                             "&:hover": {
//                                 borderColor: surfaceMain,
//                                 backgroundColor: `${surfaceMain}10`,
//                             },
//                         }}
//                     >
//                         Wyczyść
//                     </Button>
//                     <Button
//                         variant="contained"
//                         onClick={applyFilters}
//                         size="small"
//                         aria-label="Apply filters"
//                         sx={{
//                             backgroundColor: surfaceMain,
//                             "&:hover": {
//                                 backgroundColor: theme.palette.surface.dark,
//                             },
//                         }}
//                     >
//                         Zastosuj
//                     </Button>
//                     {onClose && (
//                         <Button
//                             variant="outlined"
//                             onClick={onClose}
//                             size="small"
//                             aria-label="Close"
//                             sx={{
//                                 borderColor: surfaceMain,
//                                 color: surfaceMain,
//                                 "&:hover": {
//                                     borderColor: surfaceMain,
//                                     backgroundColor: `${surfaceMain}10`,
//                                 },
//                             }}
//                         >
//                             Zamknij
//                         </Button>
//                     )}
//                 </Box>
//             </Box>
//         </React.Fragment>
//     );
// }
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Box, Autocomplete, TextField, Button, Typography, Divider } from "@mui/material";
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
            const normalizedTitles = [...new Set(titles.map(t => t.toLowerCase()))].sort((a, b) => a.localeCompare(b, "pl"));
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
            setOptions({ titles: normalizedTitles, cuisines: normalizedCuisines, tags: processedTags, dietaryRestrictions: normalizedDietary, products: normalizedProducts });
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
            "&.Mui-focused fieldset": { borderColor: surfaceMain, borderWidth: 2 },
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

    return (
        <React.Fragment>
            <Box sx={{ maxWidth: 400, width: "100%" }}>
                <Typography variant="h6" gutterBottom align="center">
                    Filtruj Przepisy
                </Typography>
                <Divider sx={{ mb: 2, borderColor: surfaceMain }} />

                <Autocomplete
                    fullWidth
                    sx={{ mb: 2 }}
                    options={["", ...options.titles]}
                    value={selected.title}
                    onChange={(_, newValue) => handleChange("title", newValue || "")}
                    getOptionLabel={option => (option === "" ? "Wszystkie" : option)}
                    renderInput={params => <TextField {...params} label={fieldTranslations.title} placeholder="Wszystkie" InputLabelProps={{ shrink: true }} sx={labelSx} />}
                />

                <Autocomplete
                    fullWidth
                    sx={{ mb: 2 }}
                    options={options.cuisines}
                    value={selected.cuisine || null}
                    onChange={(_, newValue) => handleChange("cuisine", newValue || "")}
                    renderInput={params => <TextField {...params} label={fieldTranslations.cuisine} placeholder="Wszystkie" InputLabelProps={{ shrink: true }} sx={labelSx} />}
                />

                <Autocomplete
                    fullWidth
                    sx={{ mb: 2 }}
                    multiple
                    options={options.tags}
                    value={selected.tag}
                    onChange={(_, newValue) => handleChange("tag", newValue || [])}
                    slotProps={{ chip: { sx: { backgroundColor: theme.palette.surface.light, color: "white", "& .MuiChip-deleteIcon": { color: "white", "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.2)" } } } } }}
                    renderInput={params => <TextField {...params} label={fieldTranslations.tags} placeholder="Wszystkie" InputLabelProps={{ shrink: true }} sx={labelSx} />}
                />

                <Autocomplete
                    fullWidth
                    sx={{ mb: 2 }}
                    options={dietaryOptions}
                    value={selected.dietary.length === 0 ? null : selected.dietary[0]}
                    onChange={(_, newValue) => {
                        const val = newValue === "Bez ograniczeń" ? [] : newValue ? [newValue] : [];
                        handleChange("dietary", val);
                    }}
                    getOptionLabel={option => option}
                    renderInput={params => <TextField {...params} label={fieldTranslations.dietaryRestrictions} placeholder="Bez ograniczeń" InputLabelProps={{ shrink: true }} sx={labelSx} />}
                />

                <Autocomplete
                    fullWidth
                    multiple
                    sx={{ mb: 2 }}
                    options={options.products.slice(0, 50)}
                    value={selected.product}
                    onChange={(_, newValue) => handleChange("product", newValue || [])}
                    slotProps={{ chip: { sx: { backgroundColor: theme.palette.surface.light, color: "white", "& .MuiChip-deleteIcon": { color: "white", "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.2)" } } } } }}
                    renderInput={params => <TextField {...params} label="Produkt" placeholder="Wszystkie" InputLabelProps={{ shrink: true }} sx={labelSx} />}
                />

                <Box sx={{ display: "flex", gap: 1, justifyContent: "center", flexWrap: "wrap" }}>
                    <Button variant="outlined" onClick={clearFilters} size="small" aria-label="Clear filters" sx={{ borderColor: surfaceMain, color: surfaceMain, "&:hover": { borderColor: surfaceMain, backgroundColor: `${surfaceMain}10` } }}>
                        Wyczyść
                    </Button>
                    <Button variant="contained" onClick={applyFilters} size="small" aria-label="Apply filters" sx={{ backgroundColor: surfaceMain, "&:hover": { backgroundColor: theme.palette.surface.dark } }}>
                        Zastosuj
                    </Button>
                    {onClose && (
                        <Button variant="outlined" onClick={onClose} size="small" aria-label="Close" sx={{ borderColor: surfaceMain, color: surfaceMain, "&:hover": { borderColor: surfaceMain, backgroundColor: `${surfaceMain}10` } }}>
                            Zamknij
                        </Button>
                    )}
                </Box>

                {/* Filter summary */}
                <Typography variant="body2" align="center" sx={{ mt: 2, color: theme.palette.text.secondary }}>
                    {getFilterSummary()}
                </Typography>
            </Box>
        </React.Fragment>
    );
}
