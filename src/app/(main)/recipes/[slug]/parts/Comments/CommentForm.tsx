// CommentForm.tsx

"use client";

import { useState, useEffect } from "react";
import { Box, TextField, Button, Paper } from "@mui/material";
import { useIsAdminLogged } from "@/stores";
import { errorMessages, validateComment } from "./utils";
import { darken } from "@mui/material/styles";
/* ------------------ COMPONENT ------------------ */

export default function CommentForm({ onSubmit, submitLabel = "Dodaj" }: { onSubmit: (data: { author: string; content: string }) => Promise<void>; submitLabel?: string }) {
    const [author, setAuthor] = useState("");
    const [content, setContent] = useState("");
    const [errors, setErrors] = useState<string[]>([]);

    const isAdminLogged = useIsAdminLogged();

    useEffect(() => {
        const timeout = setTimeout(() => {
            const finalAuthor = isAdminLogged ? "Piotr" : author.trim();

            const result = validateComment({
                author: finalAuthor,
                content,
            });

            setErrors(result.errors);

            if (!result.valid) {
                console.log(
                    "[COMMENT][VALIDATION_FAILED]",
                    result.errors.map(e => errorMessages[e] ?? e)
                );
            }
        }, 500);

        return () => clearTimeout(timeout);
    }, [author, content, isAdminLogged]);

    /* -------- submit (edge-case safe) -------- */
    async function handleSubmit() {
        if (!content.trim()) return;

        const finalAuthor = isAdminLogged ? "Piotr" : author.trim();
        if (!finalAuthor) return;

        const result = validateComment({
            author: finalAuthor,
            content,
        });

        if (!result.valid) {
            console.log(
                "[COMMENT][SUBMIT_BLOCKED]",
                result.errors.map(e => errorMessages[e] ?? e)
            );
            return;
        }

        await onSubmit({
            author: finalAuthor,
            content,
        });

        setAuthor("");
        setContent("");
    }

    /* -------- button logic (nie psujemy starej) -------- */
    const baseDisabled = !content.trim() || (!isAdminLogged && !author.trim());
    const validationFailed = errors.length > 0;

    return (
        <Paper
            elevation={1}
            sx={theme => ({
                backgroundColor: theme.palette.secondary.light,
                border: `1px solid ${theme.palette.secondary.dark}`,
                borderRadius: 2,
                p: 2,
            })}
        >
            <Box sx={{ position: "relative" }}>
                {/* 🟢 honeypot – NIE RUSZAMY */}
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

                {!isAdminLogged && (
                    <TextField
                        fullWidth
                        size="small"
                        label="Przedstaw się"
                        value={author}
                        onChange={e => setAuthor(e.target.value)}
                        color="secondary"
                        sx={theme => ({
                            mb: 2,

                            "& .MuiOutlinedInput-root": {
                                "& fieldset": {
                                    borderColor: theme.palette.secondary.dark,
                                },

                                "&:hover fieldset": {
                                    borderColor: theme.palette.secondary.dark,
                                },

                                "&.Mui-focused fieldset": {
                                    borderColor: theme.palette.secondary.dark,
                                    borderWidth: 2,
                                },

                                "&.Mui-focused": {
                                    boxShadow: `0 0 0 2px ${theme.palette.secondary.light}`,
                                },
                            },

                            "& .MuiInputLabel-root": {
                                color: theme.palette.secondary.dark,
                            },

                            "& .MuiInputLabel-root.Mui-focused": {
                                color: theme.palette.secondary.dark,
                            },
                        })}
                    />
                )}

                <TextField
                    fullWidth
                    multiline
                    minRows={3}
                    size="small"
                    label="Komentarz"
                    value={content}
                    onChange={e => setContent(e.target.value)}
                    sx={theme => ({
                        mb: 2,

                        "& .MuiOutlinedInput-root": {
                            position: "relative",

                            "& fieldset": {
                                borderColor: theme.palette.secondary.dark,
                            },

                            "&:hover fieldset": {
                                borderColor: theme.palette.secondary.dark,
                            },

                            "&.Mui-focused fieldset": {
                                borderColor: theme.palette.secondary.dark,
                                borderWidth: 2,
                            },

                            // 👇 focus ring (to NIE jest na fieldset!)
                            "&.Mui-focused": {
                                boxShadow: `0 0 0 2px ${theme.palette.secondary.light}`,
                            },
                        },

                        // 👇 label (normal + focus)
                        "& .MuiInputLabel-root": {
                            color: theme.palette.secondary.dark,
                        },

                        "& .MuiInputLabel-root.Mui-focused": {
                            color: theme.palette.secondary.dark,
                        },
                    })}
                />

                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={baseDisabled || validationFailed}
                    sx={theme => ({
                        backgroundColor: theme.palette.secondary.dark,
                        color: "#fff",
                        "&:hover": {
                            backgroundColor: darken(theme.palette.secondary.dark, 0.15),
                        },
                    })}
                >
                    {submitLabel}
                </Button>
            </Box>
        </Paper>
    );
}
