export const focusableSx = {
    "&:focus": {
        outline: "none",
        boxShadow: "none",
    },

    "&.Mui-focusVisible, &:focus-visible": {
        outline: "2px solid #036994",
        outlineOffset: "2px",
    },
    "& .MuiOutlinedInput-root": {
        "&:focus": {
            outline: "none",
            boxShadow: "none",
        },

        "&.Mui-focused": {
            outline: "2px solid #036994",
            outlineOffset: "2px",
        },
    },
};

export const createFocusableSx = (selector: string) => ({
    [selector]: {
        "&:focus": {
            outline: "none",
            boxShadow: "none",
        },

        "&.Mui-focused, &:focus-visible": {
            outline: "2px solid #036994",
            outlineOffset: "2px",
        },
    },
});
