import { SxProps, Theme } from "@mui/material";
import Image from "next/image";

import { Box, Card, CardContent } from "@mui/material";
import { styled } from "@mui/material/styles";

export const Section = styled(Box)(({ theme }) => ({
    margin: theme.spacing(4, 0),
}));

export const SlideWrapper = styled(Box)(({ theme }) => ({
    paddingLeft: theme.spacing(0.5),
    paddingRight: theme.spacing(0.5),
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(0.5),
}));

export const StyledCard = styled(Card)(({ theme }) => ({
    borderRadius: theme.spacing(1),
    overflow: "hidden",
}));

export const AspectBox = styled(Box)(() => ({
    position: "relative",
    width: "100%",
    paddingTop: "61.8%", // GOLDEN RATIO
    backgroundColor: "#f4f4f4",
}));

// export const SlideImage = styled("img")(() => ({
//     position: "absolute",
//     inset: 0,
//     width: "100%",
//     height: "100%",
//     objectFit: "cover",
//     display: "block",
// }));

export const Overlay = styled(CardContent)(({ theme }) => ({
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    padding: theme.spacing(1),
    background: "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.6) 100%)",
    color: theme.palette.common.white,
    textAlign: "center",
}));

export const skeletonContainerStyles: SxProps<Theme> = {
    display: "flex",
    gap: 1,
    overflow: "hidden",
};

export const skeletonStyles: SxProps<Theme> = {
    position: "absolute",
    inset: 0,
};
export const CarouselContainer = styled(Box)(() => ({
    minHeight: "346.03px",
}));

export const SlideImage = styled(Image)(() => ({
    objectFit: "cover",
}));
export const focusCardStyles = {
    "&:focus-within": {
        boxShadow: "0 0 0 3px #0d3a74, 0 0 0 5px white",
        outline: "none",
        borderRadius: "2px",
    },
    "&:focus-within:focus-visible": {
        boxShadow: `
            0 0 0 3px #0d3a74,
            0 0 0 5px white
        `,
    },
};
