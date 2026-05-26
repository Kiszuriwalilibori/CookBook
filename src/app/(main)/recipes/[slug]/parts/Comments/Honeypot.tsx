import { Box } from "@mui/material";
import { honeypotSx } from "./commentStyles";

export function Honeypot() {
    return <Box component="input" type="text" name="website" autoComplete="off" tabIndex={-1} aria-hidden="true" sx={honeypotSx} />;
}
