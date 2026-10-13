// import { SxProps, Theme } from "@mui/material";
// import Image from "next/image";

// import { Box, Card, CardContent } from "@mui/material";
// import { styled } from "@mui/material/styles";

// export const Section = styled(Box)(({ theme }) => ({
//     margin: theme.spacing(4, 0),
// }));

// export const SlideWrapper = styled(Box)(({ theme }) => ({
//     paddingLeft: theme.spacing(0.5),
//     paddingRight: theme.spacing(0.5),
//     paddingTop: theme.spacing(0.5),
//     paddingBottom: theme.spacing(0.5),
// }));

// export const StyledCard = styled(Card)(({ theme }) => ({
//     borderRadius: theme.spacing(1),
//     overflow: "hidden",
// }));

// export const AspectBox = styled(Box)(() => ({
//     position: "relative",
//     width: "100%",
//     paddingTop: "61.8%", // GOLDEN RATIO
// }));

// export const Overlay = styled(CardContent)(({ theme }) => ({
//     position: "absolute",
//     left: 0,
//     right: 0,
//     bottom: 0,
//     padding: theme.spacing(1),
//     background: "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.6) 100%)",
//     color: theme.palette.common.white,
//     textAlign: "center",
// }));

// export const skeletonContainerStyles: SxProps<Theme> = {
//     display: "flex",
//     gap: 1,
//     overflow: "hidden",
// };

// export const skeletonStyles: SxProps<Theme> = {
//     position: "absolute",
//     inset: 0,
// };
// export const CarouselContainer = styled(Box)(({ theme }) => ({
//     minHeight: "calc(61.8vw + 8px)",

//     [theme.breakpoints.up("md")]: {
//         minHeight: "calc(30.9vw + 8px)",
//     },

//     [theme.breakpoints.up("lg")]: {
//         minHeight: "calc(20.6vw + 8px)",
//     },
// }));

// export const SlideImage = styled(Image)(() => ({
//     objectFit: "cover",
// }));

import { SxProps, Theme, IconButton } from "@mui/material";
import Image from "next/image";

import { Box, Card, CardContent } from "@mui/material";
import { styled } from "@mui/material/styles";

export const Section = styled(Box)(({ theme }) => ({
    margin: theme.spacing(4, 0),
}));

export const SlideWrapper = styled(Box)(({ theme }) => ({
    padding: theme.spacing(0.5),
}));

export const StyledCard = styled(Card)(({ theme }) => ({
    borderRadius: theme.spacing(1),
    overflow: "hidden",
}));

export const AspectBox = styled(Box)(() => ({
    position: "relative",
    width: "100%",
    paddingTop: "61.8%",
}));

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

export const CarouselContainer = styled(Box)(({ theme }) => ({
    position: "relative",
    minHeight: "calc(61.8vw + 8px)",

    [theme.breakpoints.up("md")]: {
        minHeight: "calc(30.9vw + 8px)",
    },

    [theme.breakpoints.up("lg")]: {
        minHeight: "calc(20.6vw + 8px)",
    },
}));

export const EmblaViewport = styled(Box)(() => ({
    overflow: "hidden",
    width: "100%",
    outlineOffset: 4,
}));

export const EmblaContainer = styled(Box)(() => ({
    display: "flex",
    touchAction: "pan-y pinch-zoom",
}));

export const EmblaSlide = styled(Box)(({ theme }) => ({
    flex: "0 0 100%",
    minWidth: 0,

    [theme.breakpoints.up("md")]: {
        flexBasis: "50%",
    },

    [theme.breakpoints.up("lg")]: {
        flexBasis: "33.333333%",
    },
}));

export const CarouselArrow = styled(IconButton)(({ theme }) => ({
    position: "absolute",
    top: "50%",
    zIndex: 2,
    transform: "translateY(-50%)",
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[3],

    "&:hover": {
        backgroundColor: theme.palette.action.hover,
    },
}));

export const SlideImage = styled(Image)(() => ({
    objectFit: "cover",
}));
