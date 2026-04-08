import { Box, Typography } from "@mui/material";
import { JSX } from "react";
import PageTitle from "@/components/PageTitle";
import { styles } from "./about.styles";
import { content } from "./content";
import AuthorImage from "./AuthorImage";

export default function About(): JSX.Element {
    return (
        <Box id="RecipePage" sx={styles.root}>
            <PageTitle title={"O mnie i o tej stronie"} />
            <div className="container mx-auto p-4">
                <AuthorImage />

                {content.map((paragraph: string, index: number) => (
                    <Typography key={index} component="p" sx={styles.paragraph}>
                        {paragraph}
                    </Typography>
                ))}
            </div>
        </Box>
    );
}
