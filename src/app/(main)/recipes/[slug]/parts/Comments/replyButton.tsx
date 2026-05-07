import { IconButton, Tooltip } from "@mui/material";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import { replyButtonSx } from "./commentStyles";

type ReplyButtonProps = {
    onToggle: () => void;
    expanded?: boolean;
};

export function ReplyButton({ onToggle, expanded }: ReplyButtonProps) {
    return (
        <Tooltip title="Odpowiedz na komentarz" arrow>
            <IconButton aria-label="Odpowiedz na komentarz" aria-expanded={expanded} size="small" color="primary" disableRipple onClick={onToggle} sx={replyButtonSx}>
                <ChatBubbleOutlineIcon fontSize="small" />
            </IconButton>
        </Tooltip>
    );
}
