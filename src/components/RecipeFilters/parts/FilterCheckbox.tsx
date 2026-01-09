import { Box, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Status, StatusOptions } from "@/types"; 

interface StatusFilterProps {
    label: string;
    value: Status[];
    onChange: (value: Status[]) => void;
    error?: boolean;
    helperText?: string;
}

export const StatusFilter = ({ label, value = [], onChange, error, helperText }: StatusFilterProps) => {
    const theme = useTheme();
    const currentStatus = value[0] ?? ""; 

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.value as Status;
        onChange(selected ? [selected] : []); // zawsze tablica: albo [wartość] albo []
    };
    return (
        <Box sx={{ mb: 2 }}>
            <FormControl component="fieldset" error={error} fullWidth>
                <FormLabel component="legend">{label}</FormLabel>
                <RadioGroup value={currentStatus} onChange={handleChange}>
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
