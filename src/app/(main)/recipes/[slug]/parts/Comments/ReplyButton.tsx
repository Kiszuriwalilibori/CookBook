import { Button /*, IconButton, Tooltip */ } from "@mui/material";
// import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import ReplyIcon from "@mui/icons-material/Reply";
import { replyButtonSx } from "./commentStyles";

type ReplyButtonProps = {
    onToggle: () => void;
    expanded?: boolean;
    commentId: string;
    author: string;
};

export function ReplyButton({ onToggle, expanded, commentId, author }: ReplyButtonProps) {
    return (
        <Button size="small" aria-label={`Reply to comment by ${author}`} aria-expanded={expanded} aria-controls={`reply-form-${commentId}`} color="primary" disableRipple onClick={onToggle} sx={replyButtonSx} startIcon={<ReplyIcon />}>
            Odpowiedz
        </Button>
    );
}
export default ReplyButton;
//
