import React from "react";
import { Autocomplete, TextField } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { labelSx } from "../styles";

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
}
export default function FilterAutocomplete<T = string>({ label, placeholder = "Wszystkie", options, value, onChange, multiple = false, error, helperText, renderTags }: FilterAutocompleteProps<T>) {
    const theme = useTheme();

    return (
        <Autocomplete<T, boolean, false, false>
            fullWidth
            multiple={multiple}
            options={options}
            slotProps={{
                popupIndicator: { sx: { color: "var(--foreground)" } }, // Guzik rozwijania
                clearIndicator: { sx: { color: "var(--foreground)" } }, // Guzik czyszczenia
            }}
            value={value as T | T[] | null}
            onChange={(_, newValue) => onChange(newValue)}
            renderTags={multiple && renderTags ? (v: readonly T[]) => renderTags([...v]) : undefined}
            renderInput={params => <TextField {...params} label={label} placeholder={placeholder} InputLabelProps={{ shrink: true }} sx={labelSx(theme)} error={error} helperText={helperText} />}
        />
    );
}
// todo renderTags is deprecated
