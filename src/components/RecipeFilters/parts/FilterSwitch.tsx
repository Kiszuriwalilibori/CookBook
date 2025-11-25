
"use client";

import { FormControl, FormControlLabel, FormHelperText, Switch, SwitchProps } from "@mui/material";

interface FilterSwitchProps extends Omit<SwitchProps, "onChange"> {
    label: string;
    value: boolean;
    onChange: (checked: boolean) => void;
    error?: boolean;
    helperText?: string;
    placeholder?: string
}

export default function FilterSwitch({ label, value, onChange, error, helperText, placeholder, ...props }: FilterSwitchProps) {
    return (
        <FormControl error={error}>
            <FormControlLabel label={placeholder ?? label} control={<Switch checked={value} onChange={e => onChange(e.target.checked)} {...props} />} />
            {helperText && <FormHelperText>{helperText}</FormHelperText>}
        </FormControl>
    );
}
