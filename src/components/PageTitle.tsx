import React from "react";
import { Typography } from "@mui/material";

const headingSx = {
    fontSize: {
        xs: "20px",
        sm: "24px",
        md: "28px",
        lg: "32px",
        xl: "36px",
    },
    fontWeight: "bold",
    marginBottom: {
        xs: "8px",
        sm: "10px",
        md: "12px",
        lg: "14px",
        xl: "16px",
    },
    textAlign: "center",
    display: "block",
    marginLeft: "auto",
    marginRight: "auto",
};

interface Props {
    title: string;
}
const PageTitle = (props: Props) => {
    const {title} =props;
    return (
        <Typography variant="h1" sx={headingSx}>
            {title}
        </Typography>
    );
};

export default PageTitle;
