// import React from "react";
// import { Autocomplete, TextField, Typography, Box } from "@mui/material";
// import { useTheme } from "@mui/material/styles";
// import { labelSx } from "../styles";

// interface FilterAutocompleteProps<T = string> {
//     label: string;
//     placeholder?: string;
//     options: T[];
//     value: T | T[] | null;
//     onChange: (newValue: T | T[] | null) => void;
//     multiple?: boolean;
//     error?: boolean;
//     helperText?: string;
//     renderTags?: (value: T[]) => React.ReactNode;
//     getOptionLabel?: (option: T) => string;
// }

// export default function FilterAutocomplete<T = string>({ label, placeholder = "Wszystkie", options, value, onChange, multiple = false, error, helperText, renderTags, getOptionLabel }: FilterAutocompleteProps<T>) {
//     const theme = useTheme();

//     // Default label extractor if not provided
//     const defaultGetOptionLabel = (option: T): string => (typeof option === "string" ? option : String(option));

//     const finalGetOptionLabel = getOptionLabel || defaultGetOptionLabel;

//     return (
//         <Autocomplete<T, boolean, false, false>
//             fullWidth
//             multiple={multiple}
//             options={options}
//             getOptionLabel={finalGetOptionLabel}
//             slotProps={{
//                 popupIndicator: { sx: { color: "var(--foreground)" } },
//                 clearIndicator: { sx: { color: "var(--foreground)" } },
//             }}
//             value={value as T | T[] | null}
//             onChange={(_, newValue) => onChange(newValue)}
//             renderTags={multiple && renderTags ? (v: readonly T[]) => renderTags([...v]) : undefined}
//             renderOption={(props, option, { inputValue }) => {
//                 const label = finalGetOptionLabel(option);
//                 const matchIndex = label.toLowerCase().indexOf(inputValue.toLowerCase());

//                 // If no match or empty input → just render plain text
//                 if (!inputValue || matchIndex === -1) {
//                     return (
//                         <li {...props}>
//                             <Typography variant="body2">{label}</Typography>
//                         </li>
//                     );
//                 }

//                 const beforeMatch = label.slice(0, matchIndex);
//                 const matched = label.slice(matchIndex, matchIndex + inputValue.length);
//                 const afterMatch = label.slice(matchIndex + inputValue.length);

//                 return (
//                     <li {...props}>
//                         <Typography variant="body2" component="span">
//                             {beforeMatch}
//                             <Box
//                                 component="span"
//                                 sx={{
//                                     backgroundColor: theme.palette.secondary.light,
//                                     color: theme.palette.secondary.contrastText,
//                                     px: 0.5,
//                                     borderRadius: 0.5,
//                                     fontWeight: 600,
//                                 }}
//                             >
//                                 {matched}
//                             </Box>
//                             {afterMatch}
//                         </Typography>
//                     </li>
//                 );
//             }}
//             renderInput={params => <TextField {...params} label={label} placeholder={placeholder} InputLabelProps={{ shrink: true }} sx={labelSx(theme)} error={error} helperText={helperText} />}
//         />
//     );
// }

// src/components/RecipeFilters/parts/FilterAutocomplete.tsx
import React from "react";
import { Autocomplete, TextField, Typography, Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import { labelSx } from "../styles";
import { popupIndicatorSx, clearIndicatorSx, highlightSx } from "../styles";

interface FilterAutocompleteProps<T = string> {
    label: string;
    placeholder?: string;
    options: T[];
    value: T | T[] | null;
    onChange: (newValue: T | T[] | null) => void;
    multiple?: boolean;
    error?: boolean;
    helperText?: string;
    renderTags?: (value: T[]) => React.ReactNode;
    getOptionLabel?: (option: T) => string;
}

export default function FilterAutocomplete<T = string>({ label, placeholder = "Wszystkie", options, value, onChange, multiple = false, error, helperText, renderTags, getOptionLabel }: FilterAutocompleteProps<T>) {
    const theme = useTheme();

    const defaultGetOptionLabel = (option: T): string => (typeof option === "string" ? option : String(option));

    const finalGetOptionLabel = getOptionLabel || defaultGetOptionLabel;

    return (
        <Autocomplete<T, boolean, false, false>
            fullWidth
            multiple={multiple}
            options={options}
            getOptionLabel={finalGetOptionLabel}
            slotProps={{
                popupIndicator: { sx: popupIndicatorSx },
                clearIndicator: { sx: clearIndicatorSx },
            }}
            value={value as T | T[] | null}
            onChange={(_, newValue) => onChange(newValue)}
            renderTags={multiple && renderTags ? (v: readonly T[]) => renderTags([...v]) : undefined}
            renderOption={(props, option, { inputValue }) => {
                const label = finalGetOptionLabel(option);
                const matchIndex = label.toLowerCase().indexOf(inputValue.toLowerCase());

                // Extract key and remove it from props to avoid spreading it
                const { key, ...liProps } = props;

                if (!inputValue || matchIndex === -1) {
                    return (
                        <li key={key} {...liProps}>
                            <Typography variant="body2">{label}</Typography>
                        </li>
                    );
                }

                const before = label.slice(0, matchIndex);
                const match = label.slice(matchIndex, matchIndex + inputValue.length);
                const after = label.slice(matchIndex + inputValue.length);

                return (
                    <li key={key} {...liProps}>
                        <Typography variant="body2" component="span">
                            {before}
                            <Box component="span" sx={highlightSx}>
                                {match}
                            </Box>
                            {after}
                        </Typography>
                    </li>
                );
            }}
            renderInput={params => <TextField {...params} label={label} placeholder={placeholder} InputLabelProps={{ shrink: true }} sx={labelSx(theme)} error={error} helperText={helperText} />}
        />
    );
}
