import Image from "next/image";
import { Box } from "@mui/material";
import { JSX } from "react";
import PageTitle from "@/components/PageTitle";

const MIN_SIZE = 100;
const MAX_SIZE = 200;

const boxStyles = {
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
    marginBottom: "16px",
};

export default function About(): JSX.Element {
    return (
        <>
            <PageTitle title={"O mnie i o tej stronie"} />
            <div className="container mx-auto p-4">
                <Box sx={boxStyles}>
                    <Image src="/images/author.webp" alt="Author" width={MAX_SIZE} height={MAX_SIZE} style={{ objectFit: "cover" }} sizes={`(max-width: 600px) ${MIN_SIZE}px, (min-width: 1536px) ${MAX_SIZE}px, 16vw`} quality={75} />
                </Box>

                <p className="text-lg">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
            </div>
        </>
    );
}
