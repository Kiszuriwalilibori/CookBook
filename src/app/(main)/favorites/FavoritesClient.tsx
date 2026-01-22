// "use client";

// import { Box, Grid, Typography } from "@mui/material";
// import { useState, useEffect, useCallback } from "react";
// import { useRouter } from "next/navigation";

// import { RecipeCard } from "@/components";
// import ConfirmRemoveDialog from "@/components/ConfirmRemoveDialog";
// import { gridSize, pageContainerStyle } from "./styles";
// import type { Recipe } from "@/types";
// import { useFavorites } from "@/hooks";
// import { useIsUserLogged } from "@/stores/useAdminStore";

// /* =========================
//    useConfirmDialog hook
// ========================= */

// function useConfirmDialog<T>() {
//     const [item, setItem] = useState<T | null>(null);

//     const open = useCallback((value: T) => {
//         setItem(value);
//     }, []);

//     const close = useCallback(() => {
//         setItem(null);
//     }, []);

//     return {
//         item,
//         isOpen: item !== null,
//         open,
//         close,
//     };
// }

// /* =========================
//    FavoritesClient
// ========================= */

// interface Props {
//     initialRecipes: Recipe[];
// }

// export default function FavoritesClient({ initialRecipes }: Props) {
//     const router = useRouter();
//     const isUserLogged = useIsUserLogged();

//     const { favorites, addFavorite, removeFavorite, loading } = useFavorites();
//     const [displayRecipes, setDisplayRecipes] = useState<Recipe[]>(initialRecipes);

//     const confirmDialog = useConfirmDialog<Recipe>();

//     // CSR redirect if logged out
//     useEffect(() => {
//         if (!isUserLogged) {
//             router.replace("/");
//         }
//     }, [isUserLogged, router]);

//     /* =========================
//        Handlers
//     ========================= */

//     const requestRemoveFavorite = useCallback(
//         (recipe: Recipe) => {
//             confirmDialog.open(recipe);
//         },
//         [confirmDialog]
//     );

//     const confirmRemoveFavorite = useCallback(async () => {
//         if (!confirmDialog.item) return;

//         const recipe = confirmDialog.item;
//         confirmDialog.close();

//         // optimistic UI
//         setDisplayRecipes(prev => prev.filter(r => r._id !== recipe._id));

//         try {
//             await removeFavorite(recipe._id);
//         } catch (err) {
//             // rollback
//             setDisplayRecipes(prev => [...prev, recipe]);
//             console.error("[FavoritesClient] Remove failed:", err);
//         }
//     }, [confirmDialog, removeFavorite]);

//     /* =========================
//        Empty state
//     ========================= */

//     if (displayRecipes.length === 0) {
//         return (
//             <Box sx={pageContainerStyle}>
//                 <Typography variant="h6" textAlign="center" mt={4}>
//                     Nie masz jeszcze ulubionych przepisów.
//                 </Typography>
//             </Box>
//         );
//     }

//     /* =========================
//        Render
//     ========================= */

//     return (
//         <Box sx={pageContainerStyle}>
//             <Grid container spacing={3} justifyContent="center">
//                 {displayRecipes.map(recipe => (
//                     <Grid size={gridSize} key={recipe._id}>
//                         <RecipeCard recipe={recipe} isFavorite={favorites.has(recipe._id)} loading={loading} removeFavorite={() => requestRemoveFavorite(recipe)} addFavorite={() => addFavorite(recipe._id)} />
//                     </Grid>
//                 ))}
//             </Grid>

//             <ConfirmRemoveDialog open={confirmDialog.isOpen} loading={loading} title={confirmDialog.item ? `Czy na pewno chcesz usunąć ${confirmDialog.item.title} z Ulubionych?` : ""} onConfirm={confirmRemoveFavorite} onCancel={confirmDialog.close} />
//         </Box>
//     );
// }
"use client";

import { Box, Grid, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { RecipeCard, ConfirmRemoveDialog } from "@/components";
import { gridSize, pageContainerStyle } from "./styles";
import type { Recipe } from "@/types";
import { useFavorites } from "@/hooks";
import { useIsUserLogged } from "@/stores/useAdminStore";
import { useConfirmDialog } from "@/hooks/useConfirmDialog";

interface Props {
    initialRecipes: Recipe[];
}

export default function FavoritesClient({ initialRecipes }: Props) {
    const router = useRouter();
    const isUserLogged = useIsUserLogged();

    const { favorites, addFavorite, removeFavorite, loading } = useFavorites();
    const [displayRecipes, setDisplayRecipes] = useState<Recipe[]>(initialRecipes);

    // Hook confirm dialog
    const {
        isOpen,
        payload,
        loading: dialogLoading,
        openDialog,
        cancel,
        confirm,
    } = useConfirmDialog<Recipe>({
        onConfirm: async recipe => {
            // Optimistic UI
            setDisplayRecipes(prev => prev.filter(r => r._id !== recipe._id));

            try {
                await removeFavorite(recipe._id);
            } catch (err) {
                // rollback
                setDisplayRecipes(prev => [...prev, recipe]);
                console.error("[FavoritesClient] Remove failed:", err);
            }
        },
    });

    // CSR: redirect jeśli user wylogowany
    useEffect(() => {
        if (!isUserLogged) {
            router.replace("/");
        }
    }, [isUserLogged, router]);

    if (displayRecipes.length === 0) {
        return (
            <Box sx={pageContainerStyle}>
                <Typography variant="h6" textAlign="center" mt={4}>
                    Nie masz jeszcze ulubionych przepisów.
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={pageContainerStyle}>
            <Grid container spacing={3} justifyContent="center">
                {displayRecipes.map(recipe => (
                    <Grid size={gridSize} key={recipe._id}>
                        <RecipeCard
                            recipe={recipe}
                            isFavorite={favorites.has(recipe._id)}
                            loading={loading}
                            addFavorite={() => addFavorite(recipe._id)}
                            removeFavorite={() => openDialog(recipe)} // <-- otwieramy dialog
                        />
                    </Grid>
                ))}
            </Grid>

            {/* Dialog potwierdzenia */}
            {payload && <ConfirmRemoveDialog open={isOpen} loading={dialogLoading} title={payload.title} onCancel={cancel} onConfirm={confirm} />}
        </Box>
    );
}
