export const focusableSx = {
    "&:focus": {
        outline: "none",
        boxShadow: "none",
    },

    "&.Mui-focusVisible, &:focus-visible": {
        outline: "none",
        boxShadow: "0 0 0 2px  #0d3a74, 0 0 0 4px white",
        borderRadius: "1px",
    },
    "& .MuiOutlinedInput-root": {
        "&:focus": {
            outline: "none",
            boxShadow: "none",
        },

        "&.Mui-focused": {
            outline: "none",
            boxShadow: "0 0 0 2px  #0d3a74, 0 0 0 4px white",
            borderRadius: "1px",
        },
    },
};

export const touchableSx = {
    minHeight: "48px",
    minWidth: "48px",
};

export const focusableClass = `
  &:focus {
    outline: none;
    box-shadow: none;
  }

  &:focus-visible,
  &.Mui-focusVisible {
    outline: none;
    box-shadow: 0 0 0 2px #0d3a74, 0 0 0 4px white;
    border-radius: 1px;
  }

  .MuiOutlinedInput-root:focus {
    outline: none;
    box-shadow: none;
  }

  .MuiOutlinedInput-root.Mui-focused {
    outline: none;
    box-shadow: 0 0 0 2px #0d3a74, 0 0 0 4px white;
    border-radius: 1px;
  }
`;
