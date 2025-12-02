import { Box, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Status, StatusOptions } from "@/types"; // import your types

interface StatusFilterProps {
    label: string;
    value: Status | null;
    onChange: (value: Status) => void;
    error?: boolean;
    helperText?: string;
}

export const StatusFilter = ({ label, value, onChange, error, helperText }: StatusFilterProps) => {
    const theme = useTheme();

    return (
        <Box sx={{ mb: 2 }}>
            <FormControl component="fieldset" error={error} fullWidth>
                <FormLabel component="legend">{label}</FormLabel>
                <RadioGroup value={value ?? ""} onChange={e => onChange(e.target.value as Status)}>
                    {StatusOptions.map(status => (
                        <FormControlLabel key={status.value} value={status.value} control={<Radio />} label={status.title} />
                    ))}
                </RadioGroup>
                {helperText && <Box sx={{ color: theme.palette.error.main, mt: 0.5, fontSize: 12 }}>{helperText}</Box>}
            </FormControl>
        </Box>
    );
};

export default StatusFilter;
