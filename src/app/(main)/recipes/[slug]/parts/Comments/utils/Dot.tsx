import Box from "@mui/material/Box";

export const Dot = () => {
    return (
        <Box
            component="span"
            sx={{
                mx: 0.75,
                fontSize: "1.5rem",
                lineHeight: 0,
                verticalAlign: "middle",
            }}
        >
            •
        </Box>
    );
};
