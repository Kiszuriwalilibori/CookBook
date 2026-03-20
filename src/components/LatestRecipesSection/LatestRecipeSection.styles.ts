import { SxProps, Theme } from "@mui/material";
export const styles = {
    container: {
        backgroundColor: "#D6E2CF",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    } as SxProps<Theme>,

    headerBox: {
        px: 2,
        pt: 2,
        width: "100%",
        textAlign: "center",
    } as SxProps<Theme>,

    gridContainer: {
        p: 2,
        display: "grid",
        gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
        gap: 2,
        flex: 1,
        justifyContent: "center", // centrowanie całego gridu
        justifyItems: "center",
        width: "100%",
    } as SxProps<Theme>,
};
