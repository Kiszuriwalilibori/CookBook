import { Box } from "@mui/material";

export function Honeypot() {
    return (
        <Box
            component="input"
            type="text"
            name="website"
            autoComplete="off"
            tabIndex={-1}
            aria-hidden="true"
            sx={{
                position: "absolute",
                left: "-9999px",
                width: "1px",
                height: "1px",
                overflow: "hidden",
                opacity: 0,
            }}
        />
    );
}
