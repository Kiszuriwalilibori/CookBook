// "use client";

// import { FormControlLabel, Switch } from "@mui/material";

// interface FilterSwitchProps {
//     label: string;
//     value: boolean;
//     onChange: (checked: boolean) => void;
// }

// export default function FilterSwitch({ label, value, onChange }: FilterSwitchProps) {
//     return <FormControlLabel control={<Switch checked={value} onChange={e => onChange(e.target.checked)} size="medium" />} label={label} />;
// }
// "use client";

// import { FormControlLabel, Switch, SwitchProps } from "@mui/material";

// interface FilterSwitchProps extends Omit<SwitchProps, "onChange"> {
//     label: string;
//     value: boolean;
//     onChange: (checked: boolean) => void;
// }

// export default function FilterSwitch({ label, value, onChange, ...props }: FilterSwitchProps) {
//     return <FormControlLabel label={label} control={<Switch checked={value} onChange={e => onChange(e.target.checked)} {...props} />} />;
// }


"use client";

import { FormControl, FormControlLabel, FormHelperText, Switch, SwitchProps } from "@mui/material";

interface FilterSwitchProps extends Omit<SwitchProps, "onChange"> {
    label: string;
    value: boolean;
    onChange: (checked: boolean) => void;
    error?: boolean;
    helperText?: string;
}

export default function FilterSwitch({ label, value, onChange, error, helperText, ...props }: FilterSwitchProps) {
    return (
        <FormControl error={error}>
            <FormControlLabel label={label} control={<Switch checked={value} onChange={e => onChange(e.target.checked)} {...props} />} />
            {helperText && <FormHelperText>{helperText}</FormHelperText>}
        </FormControl>
    );
}
