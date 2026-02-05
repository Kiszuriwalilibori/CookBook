import { Box, Card, CardContent } from "@mui/material";
import { styled } from "@mui/material/styles";

export const Section = styled(Box)(({ theme }) => ({
    margin: theme.spacing(4, 0),
}));

export const SlideWrapper = styled(Box)(({ theme }) => ({
    paddingLeft: theme.spacing(0.5),
    paddingRight: theme.spacing(0.5),
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

export const SlideImage = styled("img")(() => ({
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
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
