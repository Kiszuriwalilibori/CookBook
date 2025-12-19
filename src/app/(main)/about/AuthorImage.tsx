import Image from "next/image";
import Box from "@mui/material/Box";

const MIN_SIZE = 100;
const MAX_SIZE = 200;

export default function AuthorImage() {
    return (
        <Box
            sx={{
                position: "relative",
                width: {
                    xs: MIN_SIZE,
                    sm: `clamp(${MIN_SIZE}px, 16vw, ${MAX_SIZE}px)`,
                    md: `clamp(${MIN_SIZE}px, 16vw, ${MAX_SIZE}px)`,
                    lg: `clamp(${MIN_SIZE}px, 16vw, ${MAX_SIZE}px)`,
                    xl: MAX_SIZE,
                },
                height: {
                    xs: MIN_SIZE,
                    sm: `clamp(${MIN_SIZE}px, 16vw, ${MAX_SIZE}px)`,
                    md: `clamp(${MIN_SIZE}px, 16vw, ${MAX_SIZE}px)`,
                    lg: `clamp(${MIN_SIZE}px, 16vw, ${MAX_SIZE}px)`,
                    xl: MAX_SIZE,
                },
                borderRadius: "50%",
                overflow: "hidden",
                mb: 2,
            }}
        >
            <Image
                src="/images/author.webp"
                alt="Author"
                fill
                sizes={`
                    (max-width: 600px) ${MIN_SIZE}px,
                    (max-width: 1536px) 16vw,
                    ${MAX_SIZE}px
                `}
                style={{
                    objectFit: "cover",
                }}
                quality={75}
                priority
            />
        </Box>
    );
}

