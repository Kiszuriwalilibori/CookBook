import { IconButton, Tooltip } from "@mui/material";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import { alpha } from "@mui/material/styles";

type ReplyButtonProps = {
    onToggle: () => void;
};

export function ReplyButton({ onToggle }: ReplyButtonProps) {
    return (
        <Tooltip title="Odpowiedz na komentarz" arrow>
            <IconButton
                size="small"
                color="primary"
                disableRipple
                onClick={onToggle}
                sx={theme => ({
                    "&:hover": {
                        backgroundColor: alpha(theme.palette.primary.light, 0.2),
                    },
                })}
            >
                <ChatBubbleOutlineIcon fontSize="small" />
            </IconButton>
        </Tooltip>
    );
}
