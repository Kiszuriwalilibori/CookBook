import { Collapse, Box } from "@mui/material";

type ReplyCollapseProps = {
    open: boolean;
    children: React.ReactNode;
    commentId: string;
};

export default function ReplyCollapse({ open, children, commentId }: ReplyCollapseProps) {
    return (
        <Collapse
            id={`reply-form-${commentId}`}
            in={open}
            timeout={400}
            sx={{ mt: 1 }}
            easing={{
                enter: "cubic-bezier(0.22, 1, 0.36, 1)",
                exit: "cubic-bezier(0.4, 0, 1, 1)",
            }}
        >
            <Box>{children}</Box>
        </Collapse>
    );
}
