// "use client";

// import { useEffect, useState, useCallback } from "react";
// import { Box, TextField, Button, Typography, Accordion, AccordionSummary, AccordionDetails, Skeleton } from "@mui/material";
// import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

// import CommentItem from "./CommentItem";
// import { buildCommentTree } from "@/utils/buildCommentTree";
// import type { RecipeComment } from "@/types";

// type OptimisticComment = RecipeComment & {
//     _temp?: boolean;
// };

// function createTempComment(data: { content: string; author: string; recipeId: string }): OptimisticComment {
//     return {
//         _id: crypto.randomUUID(),
//         recipeId: data.recipeId,
//         content: data.content,
//         author: data.author,

//         parentId: null,
//         createdAt: new Date().toISOString(),

//         fingerprint: "",
//         status: "approved",
//         likes: [],
//         likesCount: 0,

//         _temp: true,
//     };
// }

// export default function Comments({ recipeId }: { recipeId: string }) {
//     const [comments, setComments] = useState<OptimisticComment[] | null>(null);

//     const [newComment, setNewComment] = useState("");
//     const [author, setAuthor] = useState("");
//     const [formOpen, setFormOpen] = useState(false);
//     const [error, setError] = useState("");

//     const fetchComments = useCallback(async () => {
//         try {
//             const res = await fetch(`/api/comments?recipeId=${recipeId}`);
//             const data = await res.json();

//             const safeComments: OptimisticComment[] = Array.isArray(data.comments) ? data.comments.filter(Boolean) : [];

//             setComments(safeComments);
//         } catch {
//             setComments([]);
//         }
//     }, [recipeId]);

//     useEffect(() => {
//         fetchComments();
//     }, [fetchComments]);

//     const isLoading = comments === null;

//     const safeFlatComments = (comments ?? []).filter(c => !c._temp);
//     const commentTree = buildCommentTree(safeFlatComments);

//     async function handleAddComment() {
//         if (!newComment.trim() || !author.trim()) {
//             setError("Musisz wypełnić oba pola.");
//             return;
//         }

//         setError("");

//         const tempComment = createTempComment({
//             content: newComment,
//             author,
//             recipeId,
//         });

//         // 🔥 optimistic insert
//         setComments(prev => {
//             const safe = prev ?? [];
//             return [tempComment, ...safe];
//         });

//         setNewComment("");
//         setAuthor("");
//         setFormOpen(false);

//         try {
//             const res = await fetch("/api/comments", {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify({
//                     recipeId,
//                     content: tempComment.content,
//                     author: tempComment.author,
//                     fingerprint: crypto.randomUUID(),
//                 }),
//             });

//             const data = await res.json();

//             if (!data.ok) {
//                 throw new Error("Rejected");
//             }

//             const realComment: OptimisticComment = data.comment;

//             // 🔥 replace temp → real
//             setComments(prev => (prev ?? []).map(c => (c._id === tempComment._id ? realComment : c)));
//         } catch {
//             // 🔥 rollback (usunie optimistic)
//             setComments(prev => (prev ?? []).filter(c => c._id !== tempComment._id));

//             setError("Komentarz został odrzucony przez moderację.");
//         }
//     }

//     return (
//         <Accordion defaultExpanded={false} elevation={0}>
//             <AccordionSummary expandIcon={<ExpandMoreIcon />}>
//                 <Typography variant="h5">Komentarze ({safeFlatComments.length})</Typography>
//             </AccordionSummary>

//             <AccordionDetails>
//                 <Button onClick={() => setFormOpen(v => !v)} sx={{ mb: 2 }}>
//                     {formOpen ? "Anuluj" : "Dodaj komentarz"}
//                 </Button>

//                 {formOpen && (
//                     <>
//                         {error && (
//                             <Typography color="error" sx={{ mb: 1 }}>
//                                 {error}
//                             </Typography>
//                         )}

//                         <TextField
//                             fullWidth
//                             size="small"
//                             label="Imię"
//                             value={author}
//                             onChange={e => {
//                                 setAuthor(e.target.value);
//                                 setError("");
//                             }}
//                             sx={{ mb: 2 }}
//                         />

//                         <TextField
//                             fullWidth
//                             multiline
//                             minRows={3}
//                             size="small"
//                             label="Komentarz"
//                             value={newComment}
//                             onChange={e => {
//                                 setNewComment(e.target.value);
//                                 setError("");
//                             }}
//                             sx={{ mb: 2 }}
//                         />

//                         <Button variant="contained" onClick={handleAddComment} disabled={!author.trim() || !newComment.trim()}>
//                             Dodaj
//                         </Button>
//                     </>
//                 )}

//                 {isLoading ? (
//                     <Box>
//                         {[1, 2, 3].map(i => (
//                             <Skeleton key={i} height={60} />
//                         ))}
//                     </Box>
//                 ) : (
//                     <Box display="flex" flexDirection="column" gap={2}>
//                         {commentTree.map(comment => (
//                             <CommentItem key={comment._id} comment={comment} recipeId={recipeId} refresh={fetchComments} />
//                         ))}
//                     </Box>
//                 )}
//             </AccordionDetails>
//         </Accordion>
//     );
// }
// "use client";

// import { useEffect, useState, useCallback } from "react";
// import { Box, TextField, Button, Typography, Accordion, AccordionSummary, AccordionDetails, Skeleton } from "@mui/material";
// import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

// import CommentItem from "./CommentItem";
// import { buildCommentTree } from "@/utils/buildCommentTree";
// import type { RecipeComment } from "@/types";

// type OptimisticComment = RecipeComment & {
//     _temp?: boolean;
// };

// function createTempComment(data: { content: string; author: string; recipeId: string }): OptimisticComment {
//     return {
//         _id: crypto.randomUUID(),
//         recipeId: data.recipeId,
//         content: data.content,
//         author: data.author,

//         parentId: null,
//         createdAt: new Date().toISOString(),

//         fingerprint: "",
//         status: "approved",
//         likes: [],
//         likesCount: 0,

//         _temp: true,
//     };
// }

// export default function Comments({ recipeId }: { recipeId: string }) {
//     const [comments, setComments] = useState<OptimisticComment[] | null>(null);

//     const [newComment, setNewComment] = useState("");
//     const [author, setAuthor] = useState("");
//     const [formOpen, setFormOpen] = useState(false);

//     const fetchComments = useCallback(async () => {
//         try {
//             const res = await fetch(`/api/comments?recipeId=${recipeId}`);
//             const data = await res.json();

//             const safeComments: OptimisticComment[] = Array.isArray(data.comments) ? data.comments.filter(Boolean) : [];

//             setComments(safeComments);
//         } catch (err) {
//             console.error("[COMMENTS][FETCH]", err);
//             setComments([]);
//         }
//     }, [recipeId]);

//     useEffect(() => {
//         fetchComments();
//     }, [fetchComments]);

//     const isLoading = comments === null;

//     const safeFlatComments = (comments ?? []).filter(c => !c._temp);
//     const commentTree = buildCommentTree(safeFlatComments);

//     async function handleAddComment() {
//         if (!newComment.trim() || !author.trim()) {
//             console.error("[COMMENTS] missing fields");
//             return;
//         }

//         const form = document.getElementById("comment-form") as HTMLFormElement;
//         const formData = new FormData(form);
//         const honeypot = formData.get("website");

//         const tempComment = createTempComment({
//             content: newComment,
//             author,
//             recipeId,
//         });

//         // 🔥 optimistic insert
//         setComments(prev => {
//             const safe = prev ?? [];
//             return [tempComment, ...safe];
//         });

//         setNewComment("");
//         setAuthor("");
//         setFormOpen(false);

//         try {
//             const res = await fetch("/api/comments", {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify({
//                     recipeId,
//                     content: tempComment.content,
//                     author: tempComment.author,
//                     fingerprint: crypto.randomUUID(),
//                     website: honeypot, // 🟢 honeypot
//                 }),
//             });

//             const data = await res.json();

//             if (!data.ok) {
//                 throw new Error("Rejected or spam");
//             }

//             const realComment: OptimisticComment = data.comment;

//             // 🔥 replace temp → real
//             setComments(prev => (prev ?? []).map(c => (c._id === tempComment._id ? realComment : c)));
//         } catch (err) {
//             console.error("[COMMENTS][POST]", err);

//             // 🔥 rollback
//             setComments(prev => (prev ?? []).filter(c => c._id !== tempComment._id));
//         }
//     }

//     return (
//         <Accordion defaultExpanded={false} elevation={0}>
//             <AccordionSummary expandIcon={<ExpandMoreIcon />}>
//                 <Typography variant="h5">Komentarze ({safeFlatComments.length})</Typography>
//             </AccordionSummary>

//             <AccordionDetails>
//                 <Button onClick={() => setFormOpen(v => !v)} sx={{ mb: 2 }}>
//                     {formOpen ? "Anuluj" : "Dodaj komentarz"}
//                 </Button>

//                 {formOpen && (
//                     <form id="comment-form">
//                         <Box sx={{ position: "relative" }}>
//                             {/* 🟢 HONEYPOT */}
//                             <input
//                                 type="text"
//                                 name="website"
//                                 autoComplete="off"
//                                 tabIndex={-1}
//                                 aria-hidden="true"
//                                 style={{
//                                     position: "absolute",
//                                     left: "-9999px",
//                                     height: 0,
//                                     opacity: 0,
//                                 }}
//                             />

//                             <TextField fullWidth size="small" label="Imię" value={author} onChange={e => setAuthor(e.target.value)} sx={{ mb: 2 }} />

//                             <TextField fullWidth multiline minRows={3} size="small" label="Komentarz" value={newComment} onChange={e => setNewComment(e.target.value)} sx={{ mb: 2 }} />

//                             <Button variant="contained" onClick={handleAddComment} disabled={!author.trim() || !newComment.trim()}>
//                                 Dodaj
//                             </Button>
//                         </Box>
//                     </form>
//                 )}

//                 {isLoading ? (
//                     <Box>
//                         {[1, 2, 3].map(i => (
//                             <Skeleton key={i} height={60} />
//                         ))}
//                     </Box>
//                 ) : (
//                     <Box display="flex" flexDirection="column" gap={2}>
//                         {commentTree.map(comment => (
//                             <CommentItem key={comment._id} comment={comment} recipeId={recipeId} refresh={fetchComments} />
//                         ))}
//                     </Box>
//                 )}
//             </AccordionDetails>
//         </Accordion>
//     );
// }
"use client";

import { useEffect, useState, useCallback } from "react";
import { Box, Button, Typography, Accordion, AccordionSummary, AccordionDetails, Skeleton } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import CommentItem from "./CommentItem";
import CommentForm from "./CommentForm";
import { buildCommentTree } from "@/utils/buildCommentTree";
import type { RecipeComment } from "@/types";

type OptimisticComment = RecipeComment & {
    _temp?: boolean;
};

function createTempComment(data: { content: string; author: string; recipeId: string }): OptimisticComment {
    return {
        _id: crypto.randomUUID(),
        recipeId: data.recipeId,
        content: data.content,
        author: data.author,

        parentId: null,
        createdAt: new Date().toISOString(),

        fingerprint: "",
        status: "approved",
        likes: [],
        likesCount: 0,

        _temp: true,
    };
}

export default function Comments({ recipeId }: { recipeId: string }) {
    const [comments, setComments] = useState<OptimisticComment[] | null>(null);
    const [formOpen, setFormOpen] = useState(false);

    const fetchComments = useCallback(async () => {
        try {
            const res = await fetch(`/api/comments?recipeId=${recipeId}`);
            const data = await res.json();

            const safeComments: OptimisticComment[] = Array.isArray(data.comments) ? data.comments.filter(Boolean) : [];

            setComments(safeComments);
        } catch (err) {
            console.error("[COMMENTS][FETCH]", err);
            setComments([]);
        }
    }, [recipeId]);

    useEffect(() => {
        fetchComments();
    }, [fetchComments]);

    const isLoading = comments === null;

    const safeFlatComments = (comments ?? []).filter(c => !c._temp);
    const commentTree = buildCommentTree(safeFlatComments);

    return (
        <Accordion defaultExpanded={false} elevation={0}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h5">Komentarze ({safeFlatComments.length})</Typography>
            </AccordionSummary>

            <AccordionDetails>
                <Button onClick={() => setFormOpen(v => !v)} sx={{ mb: 2 }}>
                    {formOpen ? "Anuluj" : "Dodaj komentarz"}
                </Button>

                {formOpen && (
                    <CommentForm
                        submitLabel="Dodaj"
                        onSubmit={async ({ author, content }) => {
                            const tempComment = createTempComment({
                                content,
                                author,
                                recipeId,
                            });

                            // 🔥 optimistic insert
                            setComments(prev => [tempComment, ...(prev ?? [])]);

                            setFormOpen(false);

                            try {
                                const res = await fetch("/api/comments", {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify({
                                        recipeId,
                                        content,
                                        author,
                                        fingerprint: crypto.randomUUID(),
                                        website: "", // honeypot (puste)
                                    }),
                                });

                                const data = await res.json();

                                if (!data.ok) {
                                    throw new Error();
                                }

                                // 🔥 replace temp → real
                                setComments(prev => (prev ?? []).map(c => (c._id === tempComment._id ? data.comment : c)));
                            } catch (err) {
                                console.error("[COMMENTS][POST]", err);

                                // 🔥 rollback
                                setComments(prev => (prev ?? []).filter(c => c._id !== tempComment._id));
                            }
                        }}
                    />
                )}

                {isLoading ? (
                    <Box>
                        {[1, 2, 3].map(i => (
                            <Skeleton key={i} height={60} />
                        ))}
                    </Box>
                ) : (
                    <Box display="flex" flexDirection="column" gap={2}>
                        {commentTree.map(comment => (
                            <CommentItem key={comment._id} comment={comment} recipeId={recipeId} refresh={fetchComments} />
                        ))}
                    </Box>
                )}
            </AccordionDetails>
        </Accordion>
    );
}