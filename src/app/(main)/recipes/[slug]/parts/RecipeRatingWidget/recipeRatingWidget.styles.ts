import { SxProps, Theme } from "@mui/material";

export const containerSx: SxProps<Theme> = {
    display: "flex",
    flexDirection: "row",
    alignItems: "center", // wyśrodkowanie poziome
    justifyContent: "center",
    gap: 1,
    p: 0, // usuń padding
    border: "none", // usuń obramowanie
    bgcolor: "transparent", // usuń tło
    flexWrap: "wrap", // opcjonalnie na małych ekranach
};
export const textSx: SxProps<Theme> = {
    fontFamily: "Inter, sans-serif",
    color: "#000",
    textAlign: "center",
    fontWeight: 400, // wszędzie ta sama waga
    fontSize: {
        xs: "16px", // 0+
        sm: "17px", // 600+
        md: "18px", // 900+
    },
};
export const averageSx: SxProps<Theme> = {
    fontFamily: "Inter, sans-serif",
    color: "#000",
    textAlign: "center",
    fontWeight: 400, // ta sama waga
    fontSize: {
        xs: "16px",
        sm: "17px",
        md: "18px",
    },
};
export const countSx: SxProps<Theme> = {
    fontFamily: "Inter, sans-serif",
    color: "#000",
    textAlign: "center",
    fontWeight: 400,
    fontSize: {
        xs: "16px",
        sm: "17px",
        md: "18px",
    },
};

export const statusTextSx: SxProps<Theme> = {
    fontFamily: "Inter, sans-serif",
    color: "#000",
    textAlign: "center",
    fontWeight: 400,
    fontSize: {
        xs: "16px",
        sm: "17px",
        md: "18px",
    },
};

export const loadingSx: SxProps<Theme> = {
    ...statusTextSx,
    color: "primary.main",
};

export const errorSx: SxProps<Theme> = {
    ...statusTextSx,
    color: "error.main",
};

export const successSx: SxProps<Theme> = {
    ...statusTextSx,
    color: "success.main",
    fontWeight: 500,
};
