import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type { PortableTextComponents } from "@portabletext/react";
import { portableTextSx } from "../styles";

export const PortableContentComponents: Partial<PortableTextComponents> = {
    block: ({ children }) => (
        <Typography variant="body1" sx={portableTextSx.block}>
            {children}
        </Typography>
    ),
    list: ({ children }) => (
        <Box component="ul" sx={portableTextSx.list}>
            {children}
        </Box>
    ),
    listItem: ({ children }) => (
        <Box component="li" sx={portableTextSx.listItem}>
            {children}
        </Box>
    ),
    marks: {
        strong: ({ children }) => (
            <Typography component="strong" sx={portableTextSx.strong}>
                {children}
            </Typography>
        ),
        em: ({ children }) => (
            <Typography component="em" sx={portableTextSx.em}>
                {children}
            </Typography>
        ),
        link: ({ children, value }) => (
            <Typography component="a" href={value?.href || "#"} target="_blank" rel="noopener noreferrer" sx={portableTextSx.link}>
                {children}
            </Typography>
        ),
    },
};
