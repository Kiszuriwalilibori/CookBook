export const honeypotSx = {
    position: "absolute",
    left: "-9999px",
    width: 1,
    height: 1,
    opacity: 0,
    pointerEvents: "none",
};
export const textFieldRowSx = {
    display: "grid",
    gridTemplateColumns: {
        xs: "1fr",
        sm: "140px 1fr",
    },
    alignItems: {
        sm: "center",
    },
    gap: 1.5,
    mb: 2,
};
export const cancelButtonSx = {
    width: { xs: "100%", sm: "auto" },
    flex: { sm: 1 },
    minWidth: { sm: 140 },
};
export const validationErrorBoxSx = {
    minHeight: "24px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
};
