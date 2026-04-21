"use client";

import { useState } from "react";
import { Box, TextField, Button } from "@mui/material";
import { useIsAdminLogged } from "@/stores";

export default function CommentForm({ onSubmit, submitLabel = "Dodaj" }: { onSubmit: (data: { author: string; content: string }) => Promise<void>; submitLabel?: string }) {
    const [author, setAuthor] = useState("");
    const [content, setContent] = useState("");

    const isAdminLogged = useIsAdminLogged();
    console.log("isAdminLogged", isAdminLogged);
    async function handleSubmit() {
        if (!content.trim()) return;

        const finalAuthor = isAdminLogged ? "Piotr" : author.trim();

        if (!finalAuthor) return;

        await onSubmit({
            author: finalAuthor,
            content,
        });

        setAuthor("");
        setContent("");
    }

    return (
        <Box>
            <Box sx={{ position: "relative" }}>
                {/* 🟢 honeypot */}
                <input
                    type="text"
                    name="website"
                    autoComplete="off"
                    tabIndex={-1}
                    aria-hidden="true"
                    style={{
                        position: "absolute",
                        left: "-9999px",
                        height: 0,
                        opacity: 0,
                    }}
                />

                {!isAdminLogged && <TextField fullWidth size="small" label="Imię" value={author} onChange={e => setAuthor(e.target.value)} sx={{ mb: 2 }} />}

                <TextField fullWidth multiline minRows={3} size="small" label="Komentarz" value={content} onChange={e => setContent(e.target.value)} sx={{ mb: 2 }} />

                <Button variant="contained" onClick={handleSubmit} disabled={!content.trim() || (!isAdminLogged && !author.trim())}>
                    {submitLabel}
                </Button>
            </Box>
        </Box>
    );
}
