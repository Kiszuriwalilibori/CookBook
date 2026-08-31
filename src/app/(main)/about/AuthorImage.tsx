import Image from "next/image";
import Box from "@mui/material/Box";
import { authorImageWrapperSx, MAX_SIZE, MIN_SIZE } from "./AuthorImage.styles";

export default function AuthorImage() {
    return (
        <Box sx={authorImageWrapperSx}>
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
