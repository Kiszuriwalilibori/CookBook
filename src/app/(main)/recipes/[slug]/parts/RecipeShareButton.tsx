"use client";

import { useState } from "react";

import ShareIcon from "@mui/icons-material/Share";
import FacebookIcon from "@mui/icons-material/Facebook";
import XIcon from "@mui/icons-material/X";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import TelegramIcon from "@mui/icons-material/Telegram";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { styles } from "../styles";

import { IconButton, Tooltip, Menu, MenuItem, ListItemIcon, ListItemText } from "@mui/material";

import { useSnackbar } from "notistack";

interface Props {
    title: string;
}

export function RecipeShareButton({ title }: Props) {
    const { enqueueSnackbar } = useSnackbar();

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const url = typeof window !== "undefined" ? window.location.href : "";

    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);

    const openWindow = (shareUrl: string) => {
        window.open(shareUrl, "_blank", "noopener,noreferrer,width=700,height=700");

        setAnchorEl(null);
    };

    const handleShareClick = async (event: React.MouseEvent<HTMLElement>) => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title,
                    text: title,
                    url,
                });

                return;
            } catch {
                setAnchorEl(event.currentTarget);
            }
        }

        setAnchorEl(event.currentTarget);
    };

    const handleCopy = async () => {
        await navigator.clipboard.writeText(url);

        enqueueSnackbar("Link skopiowany do schowka", {
            variant: "success",
        });

        setAnchorEl(null);
    };

    return (
        <>
            <Tooltip title="Udostępnij przepis">
                <IconButton onClick={handleShareClick} sx={styles.recipeButton}>
                    <ShareIcon />
                </IconButton>
            </Tooltip>

            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
                <MenuItem onClick={() => openWindow(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`)}>
                    <ListItemIcon>
                        <FacebookIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Facebook</ListItemText>
                </MenuItem>

                <MenuItem onClick={() => openWindow(`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`)}>
                    <ListItemIcon>
                        <XIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>X (Twitter)</ListItemText>
                </MenuItem>

                <MenuItem onClick={() => openWindow(`https://wa.me/?text=${encodedTitle}%20${encodedUrl}`)}>
                    <ListItemIcon>
                        <WhatsAppIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>WhatsApp</ListItemText>
                </MenuItem>

                <MenuItem onClick={() => openWindow(`https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`)}>
                    <ListItemIcon>
                        <TelegramIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Telegram</ListItemText>
                </MenuItem>

                <MenuItem onClick={handleCopy}>
                    <ListItemIcon>
                        <ContentCopyIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Kopiuj link</ListItemText>
                </MenuItem>
            </Menu>
        </>
    );
}
