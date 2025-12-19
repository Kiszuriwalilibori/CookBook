import { Box, Typography } from "@mui/material";
import { JSX } from "react";
import PageTitle from "@/components/PageTitle";
import { styles } from "./about.styles";
import { content } from "./content";
import AuthorImage from "./AuthorImage";

//     width: {
//         xs: MIN_SIZE,
//         sm: `clamp(${MIN_SIZE}px, 16vw, ${MAX_SIZE}px)`,
//         md: `clamp(${MIN_SIZE}px, 16vw, ${MAX_SIZE}px)`,
//         lg: `clamp(${MIN_SIZE}px, 16vw, ${MAX_SIZE}px)`,
//         xl: MAX_SIZE,
//     },
//     height: {
//         xs: MIN_SIZE,
//         sm: `clamp(${MIN_SIZE}px, 16vw, ${MAX_SIZE}px)`,
//         md: `clamp(${MIN_SIZE}px, 16vw, ${MAX_SIZE}px)`,
//         lg: `clamp(${MIN_SIZE}px, 16vw, ${MAX_SIZE}px)`,
//         xl: MAX_SIZE,
//     },
//     borderRadius: "50%",
//     overflow: "hidden",
//     marginBottom: "16px",
// };

export default function About(): JSX.Element {
    return (
        <Box id="RecipePage" sx={styles.root}>
            <PageTitle title={"O mnie i o tej stronie"} />
            <div className="container mx-auto p-4">
                <AuthorImage />

                {content.map((paragraph: string, index: number) => (
                    <Typography
                        key={index}
                        component="p"
                        sx={{
                            fontFamily: "Georgia, 'Times New Roman', serif",
                            fontSize: "clamp(15px, 1.1vw, 18px)",
                            lineHeight: 1.7,
                            textAlign: "justify",
                            marginBottom: "1.2em",
                        }}
                    >
                        {paragraph}
                    </Typography>
                ))}
            </div>
        </Box>
    );
}
