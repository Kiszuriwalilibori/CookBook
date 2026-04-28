// "use client";

// import { useEffect, useState, useCallback } from "react";
// import { Box, Button, Typography, Accordion, AccordionSummary, AccordionDetails, Skeleton } from "@mui/material";
// import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

// import CommentItem from "./CommentItem";
// import CommentForm from "./CommentForm";
// import { buildCommentTree } from "@/utils/buildCommentTree";
// import { useFingerprint } from "@/hooks";
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
//     const [formOpen, setFormOpen] = useState(false);
//     const fingerprint = useFingerprint();

//     const fetchComments = useCallback(async () => {
//         try {
//             const res = await fetch(`/api/comments?recipeId=${recipeId}`);
//             const data = await res.json();
//             console.log("data from fetchcomments", data);
//             const safeComments: OptimisticComment[] = Array.isArray(data.comments) ? data.comments.filter(Boolean) : [];
//             console.log("safeComments from fetchcomments", safeComments);
//             setComments(safeComments);
//         } catch (err) {
//             console.error("[COMMENTS][FETCH]", err);
//             setComments([]);
//         }
//     }, [recipeId]);

//     useEffect(() => {
//         fetchComments();
//     }, [fetchComments]);
//     useEffect(() => {
//         console.log("state comments", comments);
//     }, [comments]);
//     const isLoading = comments === null;

//     const safeFlatComments = (comments ?? []).filter(c => !c._temp);
//     console.log("safeflatcomments", safeFlatComments);
//     const commentTree = buildCommentTree(safeFlatComments);

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
//                     <CommentForm
//                         submitLabel="Dodaj"
//                         onSubmit={async ({ author, content }) => {
//                             const tempComment = createTempComment({
//                                 content,
//                                 author,
//                                 recipeId,
//                             });

//                             // 🔥 optimistic insert
//                             setComments(prev => [tempComment, ...(prev ?? [])]);

//                             setFormOpen(false);

//                             try {
//                                 const res = await fetch("/api/comments", {
//                                     method: "POST",
//                                     headers: {
//                                         "Content-Type": "application/json",
//                                     },
//                                     body: JSON.stringify({
//                                         recipeId,
//                                         content,
//                                         author,
//                                         fingerprint,
//                                         website: "", // honeypot (puste)
//                                     }),
//                                 });

//                                 const data = await res.json();
//                                 console.log("data from form", data);

//                                 if (!data.ok) {
//                                     throw new Error();
//                                 }

//                                 // 🔥 replace temp → real
//                                 setComments(prev => (prev ?? []).map(c => (c._id === tempComment._id ? data.comment : c)));
//                             } catch (err) {
//                                 console.error("[COMMENTS][POST]", err);

//                                 // 🔥 rollback
//                                 setComments(prev => (prev ?? []).filter(c => c._id !== tempComment._id));
//                             }
//                         }}
//                     />
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
import { useFingerprint } from "@/hooks";
import type { RecipeComment } from "@/types";

export default function Comments({ recipeId }: { recipeId: string }) {
    const [comments, setComments] = useState<RecipeComment[] | null>(null);
    const [formOpen, setFormOpen] = useState(false);
    const fingerprint = useFingerprint();

    const fetchComments = useCallback(async () => {
        try {
            const res = await fetch(`/api/comments?recipeId=${recipeId}`);
            const data = await res.json();

            console.log("data from fetchcomments", data);

            const safeComments: RecipeComment[] = Array.isArray(data.comments) ? data.comments.filter(Boolean) : [];

            console.log("safeComments from fetchcomments", safeComments);

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

    // ❌ usunięty filtr _temp (clean model)
    const safeFlatComments = comments ?? [];

    console.log("safeflatcomments", safeFlatComments);

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
                            const tempId = crypto.randomUUID();

                            const optimisticComment: RecipeComment = {
                                _id: tempId,
                                recipeId,
                                content,
                                author,
                                parentId: null,
                                createdAt: new Date().toISOString(),
                                fingerprint: "",
                                status: "approved",
                                likes: [],
                                likesCount: 0,
                            };

                            // 🔥 optimistic insert
                            setComments(prev => [optimisticComment, ...(prev ?? [])]);

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
                                        fingerprint,
                                        website: "",
                                    }),
                                });

                                const data = await res.json();
                                console.log("data from form", data);

                                if (!data.ok) {
                                    throw new Error();
                                }

                                // 🔥 replace temp → real
                                setComments(prev => (prev ?? []).map(c => (c._id === tempId ? data.comment : c)));
                            } catch (err) {
                                console.error("[COMMENTS][POST]", err);

                                // 🔥 rollback
                                setComments(prev => (prev ?? []).filter(c => c._id !== tempId));
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
