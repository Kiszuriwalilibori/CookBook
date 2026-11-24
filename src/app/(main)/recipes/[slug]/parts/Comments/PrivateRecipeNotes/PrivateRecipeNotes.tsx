import { Box, Typography } from "@mui/material";
import { containerStyles, textStyles } from "../../PrivateUserNotes.styles";

interface PrivateRecipeNotesProps {
    recipeNotes: string;
}

export const PrivateRecipeNotes = ({ recipeNotes }: PrivateRecipeNotesProps) => (
    <Box sx={containerStyles}>
        <Typography variant="h5" align="center" gutterBottom>
            Twoje notatki
        </Typography>
        <Typography variant="body1" sx={textStyles}>
            {recipeNotes}
        </Typography>
    </Box>
);

export default PrivateRecipeNotes;
