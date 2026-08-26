import { Box, Chip, Grow, useMediaQuery } from "@mui/material";

import type { Theme } from "@mui/material/styles";

import { chipContainerSx, chipSx } from "../styles";

import type { ChipFieldKey } from "../RecipeFilters";

export const Chips = (value: readonly string[], key: ChipFieldKey, theme: Theme, handleChange: (key: ChipFieldKey, value: string[]) => void) => {
    const prefersReducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
    if (!value.length) return null;

    return (
        <Box sx={chipContainerSx}>
            {value.map(option => (
                <Grow key={option} in timeout={prefersReducedMotion ? 0 : 180}>
                    <Chip
                        label={option}
                        onDelete={() =>
                            handleChange(
                                key,
                                value.filter(v => v !== option)
                            )
                        }
                        sx={chipSx(theme)}
                        aria-label={`Usuń filtr: ${option}`}
                    />
                </Grow>
            ))}
        </Box>
    );
};

export default Chips;
