import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";

export const Root = styled(Box)(({ theme }) => ({
    padding: theme.spacing(6, 2),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    gap: theme.spacing(1.5),
}));

export const IconWrapper = styled(Box)(({ theme }) => ({
    fontSize: 48,
    color: theme.palette.text.secondary,
    lineHeight: 1,
}));

export const Actions = styled(Box)(({ theme }) => ({
    marginTop: theme.spacing(2),
}));
