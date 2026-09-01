// import React from "react";
// import { fireEvent, render, screen } from "@testing-library/react";

// import RecipeCard from "./RecipeCard";

// import type { Recipe } from "@/types";

// import { useIsFavorite } from "@/stores/useFavoritesStore";
// import { useFavorites } from "@/hooks";
// import { useConfirmDialog } from "@/hooks/useConfirmDialog";

// /*Komponent wyświetla tytuł przepisu.

// Komponent wyświetla opis przepisu.

// Link prowadzi do właściwej strony przepisu.

// Dla przepisu bez zdjęcia wyświetlany jest obraz zastępczy.

// Kliknięcie przycisku dodania do ulubionych dodaje przepis do ulubionych.

// Kliknięcie przycisku usunięcia z ulubionych otwiera dialog potwierdzenia.

// Podczas ładowania operacji przycisk ulubionych nie wywołuje żadnej akcji.

// Otwarty dialog potwierdzenia jest renderowany z tytułem usuwanego przepisu.

// Dialog potwierdzenia nie jest renderowany, gdy nie ma aktywnego payloadu.

// Potwierdzenie usunięcia wywołuje usunięcie przepisu z ulubionych.

// Anulowanie usunięcia zamyka dialog bez usuwania przepisu.

// Kliknięcie przycisku ulubionych podczas ładowania nie dodaje ani nie usuwa przepisu z ulubionych.

// Przycisk ulubionych jest niezależnym elementem button i nie znajduje się wewnątrz linku.

// */

// jest.mock("../../lib/sanity/imageUrl", () => ({
//     urlFor: jest.fn(() => ({
//         url: jest.fn(() => "/mock-recipe-image.jpg"),
//     })),
// }));

// jest.mock("next/link", () => {
//     return function MockLink({ children, href, passHref: _passHref, ...props }: { children: React.ReactNode; href: string; passHref?: boolean; [key: string]: unknown }) {
//         return (
//             <a href={href} {...props}>
//                 {children}
//             </a>
//         );
//     };
// });

// jest.mock("@/stores/useFavoritesStore", () => ({
//     useIsFavorite: jest.fn(),
// }));

// jest.mock("@/hooks", () => ({
//     useFavorites: jest.fn(),
// }));

// jest.mock("@/hooks/useConfirmDialog", () => ({
//     useConfirmDialog: jest.fn(),
// }));

// jest.mock("../ConfirmRemoveDialog", () => {
//     return function MockConfirmRemoveDialog({ open, loading, title, onCancel, onConfirm }: { open: boolean; loading: boolean; title: string; onCancel: () => void; onConfirm: () => void }) {
//         if (!open) {
//             return null;
//         }

//         return (
//             <div data-testid="confirm-remove-dialog">
//                 <span data-testid="dialog-title">{title}</span>

//                 <span data-testid="dialog-loading">{loading ? "loading" : "idle"}</span>

//                 <button type="button" onClick={onCancel}>
//                     Cancel
//                 </button>

//                 <button type="button" onClick={onConfirm}>
//                     Confirm
//                 </button>
//             </div>
//         );
//     };
// });

// jest.mock("./RecipeCard.Image", () => ({
//     RecipeCardImage: ({ imageUrl, title }: { imageUrl: string; title: string }) => <div data-testid="recipe-card-image" data-image-url={imageUrl} role="img" aria-label={title} />,
// }));

// jest.mock("./RecipeCard.Title", () => ({
//     RecipeCardTitle: ({ title }: { title: string }) => <span>{title}</span>,
// }));

// jest.mock("./RecipeCard.FavoriteButton", () => ({
//     RecipeCardFavoriteButton: ({ isFavorite, onClick }: { isFavorite: boolean; onClick: (event: React.MouseEvent) => void }) => (
//         <button type="button" aria-label={isFavorite ? "Usuń przepis z ulubionych" : "Dodaj przepis do ulubionych"} onClick={onClick}>
//             {isFavorite ? "Remove favorite" : "Add favorite"}
//         </button>
//     ),
// }));

// jest.mock("../Common/Separator/Separator", () => {
//     return function MockSeparator() {
//         return <hr data-testid="separator" />;
//     };
// });

// const mockedUseIsFavorite = jest.mocked(useIsFavorite);
// const mockedUseFavorites = jest.mocked(useFavorites);
// const mockedUseConfirmDialog = jest.mocked(useConfirmDialog);

// const recipe = {
//     _id: "recipe-123",
//     title: "Kurczak z imbirem",
//     slug: {
//         current: "kurczak-z-imbirem",
//     },
//     description: {
//         title: "Łatwy i aromatyczny kurczak.",
//         firstBlockText: {
//             children: [
//                 {
//                     text: "Opis przepisu.",
//                 },
//             ],
//         },
//         image: undefined,
//     },
// } as Recipe;

// describe("RecipeCard", () => {
//     const addFavorite = jest.fn();
//     const removeFavorite = jest.fn();
//     const isLoading = jest.fn();

//     const openDialog = jest.fn();
//     const cancel = jest.fn();
//     const confirm = jest.fn();

//     // beforeEach(() => {
//     //     jest.clearAllMocks();

//     //     addFavorite.mockResolvedValue(undefined);
//     //     removeFavorite.mockResolvedValue(undefined);

//     //     isLoading.mockReturnValue(false);

//     //     mockedUseFavorites.mockReturnValue({
//     //         favorites: new Set<string>(),
//     //         addFavorite,
//     //         removeFavorite,
//     //         isLoading,
//     //     });

//     //     mockedUseConfirmDialog.mockReturnValue({
//     //         isOpen: false,
//     //         payload: null,
//     //         loading: false,
//     //         openDialog,
//     //         cancel,
//     //         confirm,
//     //     });
//     // });
//     beforeEach(() => {
//         jest.clearAllMocks();

//         addFavorite.mockResolvedValue(undefined);
//         removeFavorite.mockResolvedValue(undefined);

//         mockedUseFavorites.mockReturnValue({
//             isFavorite: false,
//             isLoading: false,
//             addFavorite,
//             removeFavorite,
//         });

//         mockedUseConfirmDialog.mockReturnValue({
//             isOpen: false,
//             payload: null,
//             loading: false,
//             openDialog,
//             cancel,
//             confirm,
//         });
//     });
//     it("renders recipe content", () => {
//         mockedUseIsFavorite.mockReturnValue(false);

//         render(<RecipeCard recipe={recipe} />);

//         expect(screen.getByText("Kurczak z imbirem")).toBeInTheDocument();

//         expect(screen.getByText("Łatwy i aromatyczny kurczak.")).toBeInTheDocument();

//         expect(screen.getByTestId("separator")).toBeInTheDocument();

//         expect(screen.getByTestId("recipe-card-image")).toHaveAttribute("aria-label", recipe.title);
//     });

//     it("links to the recipe page", () => {
//         mockedUseIsFavorite.mockReturnValue(false);

//         render(<RecipeCard recipe={recipe} />);

//         expect(screen.getByRole("link")).toHaveAttribute("href", "/recipes/kurczak-z-imbirem");
//     });

//     it("uses placeholder image when recipe has no image", () => {
//         mockedUseIsFavorite.mockReturnValue(false);

//         render(<RecipeCard recipe={recipe} />);

//         expect(screen.getByTestId("recipe-card-image")).toHaveAttribute("data-image-url", "/placeholder-image.jpg");
//     });

//     it("adds recipe to favorites when it is not a favorite", () => {
//         mockedUseIsFavorite.mockReturnValue(false);

//         render(<RecipeCard recipe={recipe} />);

//         fireEvent.click(
//             screen.getByRole("button", {
//                 name: "Dodaj przepis do ulubionych",
//             })
//         );

//         expect(addFavorite).toHaveBeenCalledTimes(1);
//         expect(addFavorite).toHaveBeenCalledWith(recipe._id);

//         expect(openDialog).not.toHaveBeenCalled();
//         expect(removeFavorite).not.toHaveBeenCalled();
//     });

//     it("opens confirmation dialog when removing a favorite", () => {
//         mockedUseIsFavorite.mockReturnValue(true);

//         render(<RecipeCard recipe={recipe} />);

//         fireEvent.click(
//             screen.getByRole("button", {
//                 name: "Usuń przepis z ulubionych",
//             })
//         );

//         expect(openDialog).toHaveBeenCalledTimes(1);
//         expect(openDialog).toHaveBeenCalledWith(recipe);

//         expect(addFavorite).not.toHaveBeenCalled();
//         expect(removeFavorite).not.toHaveBeenCalled();
//     });

//     it("does not trigger favorite action while loading", () => {
//         mockedUseIsFavorite.mockReturnValue(false);
//         isLoading.mockReturnValue(true);

//         render(<RecipeCard recipe={recipe} />);

//         fireEvent.click(
//             screen.getByRole("button", {
//                 name: "Dodaj przepis do ulubionych",
//             })
//         );

//         expect(addFavorite).not.toHaveBeenCalled();
//         expect(openDialog).not.toHaveBeenCalled();
//         expect(removeFavorite).not.toHaveBeenCalled();
//     });

//     it("renders confirmation dialog when it is open", () => {
//         mockedUseIsFavorite.mockReturnValue(true);

//         mockedUseConfirmDialog.mockReturnValue({
//             isOpen: true,
//             payload: recipe,
//             loading: false,
//             openDialog,
//             cancel,
//             confirm,
//         });

//         render(<RecipeCard recipe={recipe} />);

//         expect(screen.getByTestId("confirm-remove-dialog")).toBeInTheDocument();

//         expect(screen.getByTestId("dialog-title")).toHaveTextContent(recipe.title);
//     });

//     it("does not render confirmation dialog when there is no payload", () => {
//         mockedUseIsFavorite.mockReturnValue(true);

//         render(<RecipeCard recipe={recipe} />);

//         expect(screen.queryByTestId("confirm-remove-dialog")).not.toBeInTheDocument();
//     });

//     it("confirms favorite removal", () => {
//         mockedUseIsFavorite.mockReturnValue(true);

//         mockedUseConfirmDialog.mockReturnValue({
//             isOpen: true,
//             payload: recipe,
//             loading: false,
//             openDialog,
//             cancel,
//             confirm,
//         });

//         render(<RecipeCard recipe={recipe} />);

//         fireEvent.click(
//             screen.getByRole("button", {
//                 name: "Confirm",
//             })
//         );

//         expect(confirm).toHaveBeenCalledTimes(1);
//     });

//     it("cancels favorite removal", () => {
//         mockedUseIsFavorite.mockReturnValue(true);

//         mockedUseConfirmDialog.mockReturnValue({
//             isOpen: true,
//             payload: recipe,
//             loading: false,
//             openDialog,
//             cancel,
//             confirm,
//         });

//         render(<RecipeCard recipe={recipe} />);

//         fireEvent.click(
//             screen.getByRole("button", {
//                 name: "Cancel",
//             })
//         );

//         expect(cancel).toHaveBeenCalledTimes(1);
//     });

//     it("does not add or remove favorite when the favorite button is clicked while loading", () => {
//         mockedUseIsFavorite.mockReturnValue(true);
//         isLoading.mockReturnValue(true);

//         render(<RecipeCard recipe={recipe} />);

//         fireEvent.click(
//             screen.getByRole("button", {
//                 name: "Usuń przepis z ulubionych",
//             })
//         );

//         expect(openDialog).not.toHaveBeenCalled();
//         expect(addFavorite).not.toHaveBeenCalled();
//         expect(removeFavorite).not.toHaveBeenCalled();
//     });
//     it("renders the favorite button outside the recipe link", () => {
//         render(<RecipeCard recipe={recipe} />);

//         const link = screen.getByRole("link", {
//             name: /Kurczak z imbirem/i,
//         });

//         const favoriteButton = screen.getByRole("button", {
//             name: "Usuń przepis z ulubionych",
//         });

//         expect(link).not.toContainElement(favoriteButton);
//         expect(favoriteButton).toBeInTheDocument();
//     });
// });
import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";

import RecipeCard from "./RecipeCard";

import type { Recipe } from "@/types";

import { useFavorites } from "@/hooks";
import { useConfirmDialog } from "@/hooks/useConfirmDialog";

/*
Komponent wyświetla tytuł przepisu.

Komponent wyświetla opis przepisu.

Link prowadzi do właściwej strony przepisu.

Dla przepisu bez zdjęcia wyświetlany jest obraz zastępczy.

Kliknięcie przycisku dodania do ulubionych dodaje przepis do ulubionych.

Kliknięcie przycisku usunięcia z ulubionych otwiera dialog potwierdzenia.

Podczas ładowania operacji przycisk ulubionych nie wywołuje żadnej akcji.

Otwarty dialog potwierdzenia jest renderowany z tytułem usuwanego przepisu.

Dialog potwierdzenia nie jest renderowany, gdy nie ma aktywnego payloadu.

Potwierdzenie usunięcia wywołuje usunięcie przepisu z ulubionych.

Anulowanie usunięcia zamyka dialog bez usuwania przepisu.

Kliknięcie przycisku ulubionych podczas ładowania nie dodaje ani nie usuwa przepisu z ulubionych.

Przycisk ulubionych jest niezależnym elementem button i nie znajduje się wewnątrz linku.
*/

jest.mock("../../lib/sanity/imageUrl", () => ({
    urlFor: jest.fn(() => ({
        url: jest.fn(() => "/mock-recipe-image.jpg"),
    })),
}));

jest.mock("next/link", () => {
    return function MockLink({ children, href, passHref: _passHref, ...props }: { children: React.ReactNode; href: string; passHref?: boolean; [key: string]: unknown }) {
        return (
            <a href={href} {...props}>
                {children}
            </a>
        );
    };
});

jest.mock("@/hooks", () => ({
    useFavorites: jest.fn(),
}));

jest.mock("@/hooks/useConfirmDialog", () => ({
    useConfirmDialog: jest.fn(),
}));

jest.mock("../ConfirmRemoveDialog", () => {
    return function MockConfirmRemoveDialog({ open, loading, title, onCancel, onConfirm }: { open: boolean; loading: boolean; title: string; onCancel: () => void; onConfirm: () => void }) {
        if (!open) {
            return null;
        }

        return (
            <div data-testid="confirm-remove-dialog">
                <span data-testid="dialog-title">{title}</span>

                <span data-testid="dialog-loading">{loading ? "loading" : "idle"}</span>

                <button type="button" onClick={onCancel}>
                    Cancel
                </button>

                <button type="button" onClick={onConfirm}>
                    Confirm
                </button>
            </div>
        );
    };
});

jest.mock("./RecipeCard.Image", () => ({
    RecipeCardImage: ({ imageUrl, title }: { imageUrl: string; title: string }) => <div data-testid="recipe-card-image" data-image-url={imageUrl} role="img" aria-label={title} />,
}));

jest.mock("./RecipeCard.Title", () => ({
    RecipeCardTitle: ({ title }: { title: string }) => <span>{title}</span>,
}));

jest.mock("./RecipeCard.FavoriteButton", () => ({
    RecipeCardFavoriteButton: ({ isFavorite, onClick }: { isFavorite: boolean; onClick: (event: React.MouseEvent) => void }) => (
        <button type="button" aria-label={isFavorite ? "Usuń przepis z ulubionych" : "Dodaj przepis do ulubionych"} onClick={onClick}>
            {isFavorite ? "Remove favorite" : "Add favorite"}
        </button>
    ),
}));

jest.mock("../Common/Separator/Separator", () => {
    return function MockSeparator() {
        return <hr data-testid="separator" />;
    };
});

const mockedUseFavorites = jest.mocked(useFavorites);
const mockedUseConfirmDialog = jest.mocked(useConfirmDialog);

const recipe = {
    _id: "recipe-123",
    title: "Kurczak z imbirem",
    slug: {
        current: "kurczak-z-imbirem",
    },
    description: {
        title: "Łatwy i aromatyczny kurczak.",
        firstBlockText: {
            children: [
                {
                    text: "Opis przepisu.",
                },
            ],
        },
        image: undefined,
    },
} as Recipe;

describe("RecipeCard", () => {
    const addFavorite = jest.fn();
    const removeFavorite = jest.fn();
    const afterClose = jest.fn();
    const openDialog = jest.fn();
    const cancel = jest.fn();
    const confirm = jest.fn();

    let isFavorite = false;
    let isLoading = false;

    beforeEach(() => {
        jest.clearAllMocks();

        isFavorite = false;
        isLoading = false;

        addFavorite.mockResolvedValue(undefined);
        removeFavorite.mockResolvedValue(undefined);

        mockedUseFavorites.mockReturnValue({
            isFavorite,
            isLoading,
            addFavorite,
            removeFavorite,
        });

        mockedUseConfirmDialog.mockReturnValue({
            isOpen: false,
            payload: null,
            loading: false,
            openDialog,
            cancel,
            confirm,
            afterClose,
        });
    });

    it("renders recipe content", () => {
        render(<RecipeCard recipe={recipe} />);

        expect(screen.getByText("Kurczak z imbirem")).toBeInTheDocument();

        expect(screen.getByText("Łatwy i aromatyczny kurczak.")).toBeInTheDocument();

        expect(screen.getByTestId("separator")).toBeInTheDocument();

        expect(screen.getByTestId("recipe-card-image")).toHaveAttribute("aria-label", recipe.title);
    });

    it("links to the recipe page", () => {
        render(<RecipeCard recipe={recipe} />);

        expect(screen.getByRole("link")).toHaveAttribute("href", "/recipes/kurczak-z-imbirem");
    });

    it("uses placeholder image when recipe has no image", () => {
        render(<RecipeCard recipe={recipe} />);

        expect(screen.getByTestId("recipe-card-image")).toHaveAttribute("data-image-url", "/placeholder-image.jpg");
    });

    it("adds recipe to favorites when it is not a favorite", () => {
        isFavorite = false;

        mockedUseFavorites.mockReturnValue({
            isFavorite,
            isLoading,
            addFavorite,
            removeFavorite,
        });

        render(<RecipeCard recipe={recipe} />);

        fireEvent.click(
            screen.getByRole("button", {
                name: "Dodaj przepis do ulubionych",
            })
        );

        expect(addFavorite).toHaveBeenCalledTimes(1);
        expect(openDialog).not.toHaveBeenCalled();
        expect(removeFavorite).not.toHaveBeenCalled();
    });

    it("opens confirmation dialog when removing a favorite", () => {
        isFavorite = true;

        mockedUseFavorites.mockReturnValue({
            isFavorite,
            isLoading,
            addFavorite,
            removeFavorite,
        });

        render(<RecipeCard recipe={recipe} />);

        fireEvent.click(
            screen.getByRole("button", {
                name: "Usuń przepis z ulubionych",
            })
        );

        expect(openDialog).toHaveBeenCalledTimes(1);
        expect(openDialog).toHaveBeenCalledWith(recipe);

        expect(addFavorite).not.toHaveBeenCalled();
        expect(removeFavorite).not.toHaveBeenCalled();
    });

    it("does not trigger favorite action while loading", () => {
        isFavorite = false;
        isLoading = true;

        mockedUseFavorites.mockReturnValue({
            isFavorite,
            isLoading,
            addFavorite,
            removeFavorite,
        });

        render(<RecipeCard recipe={recipe} />);

        fireEvent.click(
            screen.getByRole("button", {
                name: "Dodaj przepis do ulubionych",
            })
        );

        expect(addFavorite).not.toHaveBeenCalled();
        expect(openDialog).not.toHaveBeenCalled();
        expect(removeFavorite).not.toHaveBeenCalled();
    });

    it("renders confirmation dialog when it is open", () => {
        isFavorite = true;

        mockedUseFavorites.mockReturnValue({
            isFavorite,
            isLoading,
            addFavorite,
            removeFavorite,
        });

        mockedUseConfirmDialog.mockReturnValue({
            isOpen: true,
            payload: recipe,
            loading: false,
            openDialog,
            cancel,
            confirm,
            afterClose,
        });

        render(<RecipeCard recipe={recipe} />);

        expect(screen.getByTestId("confirm-remove-dialog")).toBeInTheDocument();

        expect(screen.getByTestId("dialog-title")).toHaveTextContent(recipe.title);
    });

    it("does not render confirmation dialog when there is no payload", () => {
        isFavorite = true;

        mockedUseFavorites.mockReturnValue({
            isFavorite,
            isLoading,
            addFavorite,
            removeFavorite,
        });

        render(<RecipeCard recipe={recipe} />);

        expect(screen.queryByTestId("confirm-remove-dialog")).not.toBeInTheDocument();
    });

    it("confirms favorite removal", () => {
        isFavorite = true;

        mockedUseFavorites.mockReturnValue({
            isFavorite,
            isLoading,
            addFavorite,
            removeFavorite,
        });

        mockedUseConfirmDialog.mockReturnValue({
            isOpen: true,
            payload: recipe,
            loading: false,
            openDialog,
            cancel,
            confirm,
            afterClose,
        });

        render(<RecipeCard recipe={recipe} />);

        fireEvent.click(
            screen.getByRole("button", {
                name: "Confirm",
            })
        );

        expect(confirm).toHaveBeenCalledTimes(1);
    });

    it("cancels favorite removal", () => {
        isFavorite = true;

        mockedUseFavorites.mockReturnValue({
            isFavorite,
            isLoading,
            addFavorite,
            removeFavorite,
        });

        mockedUseConfirmDialog.mockReturnValue({
            isOpen: true,
            payload: recipe,
            loading: false,
            openDialog,
            cancel,
            confirm,
            afterClose,
        });

        render(<RecipeCard recipe={recipe} />);

        fireEvent.click(
            screen.getByRole("button", {
                name: "Cancel",
            })
        );

        expect(cancel).toHaveBeenCalledTimes(1);
    });

    it("does not add or remove favorite when the favorite button is clicked while loading", () => {
        isFavorite = true;
        isLoading = true;

        mockedUseFavorites.mockReturnValue({
            isFavorite,
            isLoading,
            addFavorite,
            removeFavorite,
        });

        render(<RecipeCard recipe={recipe} />);

        fireEvent.click(
            screen.getByRole("button", {
                name: "Usuń przepis z ulubionych",
            })
        );

        expect(openDialog).not.toHaveBeenCalled();
        expect(addFavorite).not.toHaveBeenCalled();
        expect(removeFavorite).not.toHaveBeenCalled();
    });

    it("renders the favorite button outside the recipe link", () => {
        isFavorite = true;

        mockedUseFavorites.mockReturnValue({
            isFavorite,
            isLoading,
            addFavorite,
            removeFavorite,
        });

        render(<RecipeCard recipe={recipe} />);

        const link = screen.getByRole("link", {
            name: /Kurczak z imbirem/i,
        });

        const favoriteButton = screen.getByRole("button", {
            name: "Usuń przepis z ulubionych",
        });

        expect(link).not.toContainElement(favoriteButton);
        expect(favoriteButton).toBeInTheDocument();
    });
});
