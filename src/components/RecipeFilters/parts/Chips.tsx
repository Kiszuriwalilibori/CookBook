import { Box, Chip } from "@mui/material";
import type { Theme } from "@mui/material/styles";
import { limitedChipBoxSx, chipSx, hiddenChipSx } from "../styles";
import type { ChipFieldKey } from "../RecipeFilters";

/**
 * Renders a limited number of chips for a multi-select filter field.
 * Shows up to MAX_VISIBLE_CHIPS and a "+N więcej" indicator if hidden chips exist.
 */
export const Chips = (value: readonly string[], key: ChipFieldKey, theme: Theme, handleChange: (key: ChipFieldKey, value: string[]) => void) => {
    if (!value.length) return null;

    const MAX_VISIBLE_CHIPS = 3;
    const visible = value.slice(0, MAX_VISIBLE_CHIPS);
    const hiddenCount = value.length - visible.length;
    const isScrollable = value.length > MAX_VISIBLE_CHIPS;

    return (
        <Box sx={limitedChipBoxSx(isScrollable)}>
            {visible.map(option => (
                <Chip
                    key={option}
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
            ))}
            {hiddenCount > 0 && <Chip label={`+${hiddenCount} więcej`} sx={hiddenChipSx(theme)} />}
        </Box>
    );
};

export default Chips;
