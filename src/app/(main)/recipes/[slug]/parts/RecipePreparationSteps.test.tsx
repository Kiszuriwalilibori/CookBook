/*
================================================================================
TESTY KOMPONENTU RecipePreparationSteps
================================================================================

1. Brak kroków przygotowania
   - Sprawdzamy, czy komponent niczego nie wyświetla, gdy przepis nie ma kroków.

2. Wyświetlanie nagłówka i kroków
   - Sprawdzamy, czy pojawia się nagłówek „Przygotowanie”.
   - Sprawdzamy, czy wyświetlana jest treść wszystkich kroków.

3. Początkowy aktywny krok
   - Sprawdzamy, czy po załadowaniu przepisu aktywny jest pierwszy krok.
   - Sprawdzamy, czy licznik pokazuje prawidłową wartość.

4. Domyślnie rozwinięte kroki
   - Sprawdzamy, czy wszystkie akordeony są początkowo rozwinięte.

5. Obserwowanie kroków
   - Sprawdzamy, czy IntersectionObserver obserwuje każdy krok przygotowania.

6. Zmiana aktywnego kroku
   - Sprawdzamy, czy aktywny krok zmienia się, gdy inny krok pojawia się w widocznym obszarze strony.

7. Wybór najwyższego widocznego kroku
   - Sprawdzamy, czy przy jednoczesnej widoczności kilku kroków aktywny zostaje ten o najwyższym numerze.

8. Zachowanie poprzedniego aktywnego kroku
   - Sprawdzamy, czy po zniknięciu najwyższego widocznego kroku aktywność wraca do poprzedniego widocznego kroku.

9. Brak zmiany przy opuszczeniu widoku
   - Sprawdzamy, czy aktywny krok nie zmienia się, gdy wszystkie kroki opuszczają widoczny obszar.

10. Pasek postępu
    - Sprawdzamy, czy pasek postępu pokazuje prawidłową wartość początkową.
    - Sprawdzamy, czy aktualizuje się po zmianie aktywnego kroku.

11. Notatki do kroków
    - Sprawdzamy, czy notatki przypisane do kroków są wyświetlane.

12. Czyszczenie IntersectionObserver
    - Sprawdzamy, czy obserwator zostaje odłączony po odmontowaniu komponentu.

13. Wymiary zdjęć pobierane z Sanity
    - Sprawdzamy, czy komponent wykorzystuje rzeczywistą szerokość i wysokość zdjęcia
      zapisane w metadata.dimensions.

14. Domyślne wymiary zdjęć
    - Sprawdzamy, czy przy braku metadanych zdjęcie otrzymuje wymiary zastępcze:
      1200 × 800.

================================================================================
*/
import { render, screen, cleanup } from "@testing-library/react";
import { act } from "react";
import { RecipePreparationSteps } from "./RecipePreparationSteps";
import type { Recipe } from "@/types";

const mockObserve = jest.fn();
const mockUnobserve = jest.fn();
const mockDisconnect = jest.fn();

let intersectionObserverCallback: IntersectionObserverCallback | undefined;

class MockIntersectionObserver {
    constructor(callback: IntersectionObserverCallback) {
        intersectionObserverCallback = callback;
    }

    observe = mockObserve;
    unobserve = mockUnobserve;
    disconnect = mockDisconnect;
}

Object.defineProperty(global, "IntersectionObserver", {
    writable: true,
    value: MockIntersectionObserver,
});

const createRecipe = (preparationSteps: NonNullable<Recipe["preparationSteps"]>): Recipe =>
    ({
        preparationSteps,
    }) as Recipe;

const createStep = (index: number): NonNullable<Recipe["preparationSteps"]>[number] => {
    const content: NonNullable<NonNullable<Recipe["preparationSteps"]>[number]["content"]> = [
        {
            _key: `content-${index}`,
            _type: "block",
            children: [
                {
                    _key: `span-${index}`,
                    _type: "span",
                    text: `Treść kroku ${index}`,
                    marks: [],
                },
            ],
            markDefs: [],
            style: "normal",
        },
    ];

    return {
        _key: `step-${index}`,
        image: undefined,
        content,
        notes: `Notatka do kroku ${index}`,
    };
};

describe("RecipePreparationSteps", () => {
    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
        intersectionObserverCallback = undefined;
    });

    it("does not render when there are no preparation steps", () => {
        render(<RecipePreparationSteps recipe={createRecipe([])} />);

        expect(screen.queryByText("Przygotowanie")).not.toBeInTheDocument();
        expect(screen.queryByText(/Krok \d+ \/ \d+/)).not.toBeInTheDocument();
    });

    it("renders the preparation heading and all steps", () => {
        const steps = [createStep(1), createStep(2), createStep(3)];

        render(<RecipePreparationSteps recipe={createRecipe(steps)} />);

        expect(screen.getByRole("heading", { name: "Przygotowanie" })).toBeInTheDocument();

        expect(screen.getByText("Treść kroku 1")).toBeInTheDocument();
        expect(screen.getByText("Treść kroku 2")).toBeInTheDocument();
        expect(screen.getByText("Treść kroku 3")).toBeInTheDocument();
    });

    it("shows the first step as active initially", () => {
        const steps = [createStep(1), createStep(2), createStep(3)];

        render(<RecipePreparationSteps recipe={createRecipe(steps)} />);

        expect(screen.getByText("Krok 1 / 3")).toBeInTheDocument();
    });

    it("renders all accordions expanded by default", () => {
        const steps = [createStep(1), createStep(2), createStep(3)];

        render(<RecipePreparationSteps recipe={createRecipe(steps)} />);

        const accordions = screen.getAllByRole("button");

        expect(accordions).toHaveLength(3);

        accordions.forEach(accordion => {
            expect(accordion).toHaveAttribute("aria-expanded", "true");
        });
    });

    it("observes every preparation step", () => {
        const steps = [createStep(1), createStep(2), createStep(3)];

        render(<RecipePreparationSteps recipe={createRecipe(steps)} />);

        expect(mockObserve).toHaveBeenCalledTimes(3);
    });

    it("updates the active step when another step becomes visible", () => {
        const steps = [createStep(1), createStep(2), createStep(3)];

        render(<RecipePreparationSteps recipe={createRecipe(steps)} />);

        expect(screen.getByText("Krok 1 / 3")).toBeInTheDocument();

        const stepTwo = document.querySelector('[data-step-index="1"]');

        expect(stepTwo).not.toBeNull();

        act(() => {
            intersectionObserverCallback?.(
                [
                    {
                        isIntersecting: true,
                        target: stepTwo!,
                    } as IntersectionObserverEntry,
                ],
                {} as IntersectionObserver
            );
        });

        expect(screen.getByText("Krok 2 / 3")).toBeInTheDocument();
        expect(screen.queryByText("Krok 1 / 3")).not.toBeInTheDocument();
    });

    it("uses the highest visible step when multiple steps are visible", () => {
        const steps = [createStep(1), createStep(2), createStep(3)];

        render(<RecipePreparationSteps recipe={createRecipe(steps)} />);

        const stepTwo = document.querySelector('[data-step-index="1"]');
        const stepThree = document.querySelector('[data-step-index="2"]');

        expect(stepTwo).not.toBeNull();
        expect(stepThree).not.toBeNull();

        act(() => {
            intersectionObserverCallback?.(
                [
                    {
                        isIntersecting: true,
                        target: stepTwo!,
                    } as IntersectionObserverEntry,
                    {
                        isIntersecting: true,
                        target: stepThree!,
                    } as IntersectionObserverEntry,
                ],
                {} as IntersectionObserver
            );
        });

        expect(screen.getByText("Krok 3 / 3")).toBeInTheDocument();
    });

    it("keeps the previous visible step active when the highest visible step leaves the viewport", () => {
        const steps = [createStep(1), createStep(2), createStep(3)];

        render(<RecipePreparationSteps recipe={createRecipe(steps)} />);

        const stepTwo = document.querySelector('[data-step-index="1"]');
        const stepThree = document.querySelector('[data-step-index="2"]');

        expect(stepTwo).not.toBeNull();
        expect(stepThree).not.toBeNull();

        act(() => {
            intersectionObserverCallback?.(
                [
                    {
                        isIntersecting: true,
                        target: stepTwo!,
                    } as IntersectionObserverEntry,
                    {
                        isIntersecting: true,
                        target: stepThree!,
                    } as IntersectionObserverEntry,
                ],
                {} as IntersectionObserver
            );
        });

        expect(screen.getByText("Krok 3 / 3")).toBeInTheDocument();

        act(() => {
            intersectionObserverCallback?.(
                [
                    {
                        isIntersecting: false,
                        target: stepThree!,
                    } as IntersectionObserverEntry,
                ],
                {} as IntersectionObserver
            );
        });

        expect(screen.getByText("Krok 2 / 3")).toBeInTheDocument();
    });

    it("does not change the active step when all visible steps leave the viewport", () => {
        const steps = [createStep(1), createStep(2)];

        render(<RecipePreparationSteps recipe={createRecipe(steps)} />);

        const stepTwo = document.querySelector('[data-step-index="1"]');

        expect(stepTwo).not.toBeNull();

        act(() => {
            intersectionObserverCallback?.(
                [
                    {
                        isIntersecting: true,
                        target: stepTwo!,
                    } as IntersectionObserverEntry,
                ],
                {} as IntersectionObserver
            );
        });

        expect(screen.getByText("Krok 2 / 2")).toBeInTheDocument();

        act(() => {
            intersectionObserverCallback?.(
                [
                    {
                        isIntersecting: false,
                        target: stepTwo!,
                    } as IntersectionObserverEntry,
                ],
                {} as IntersectionObserver
            );
        });

        expect(screen.getByText("Krok 2 / 2")).toBeInTheDocument();
    });

    it("updates the progress bar when the active step changes", () => {
        const steps = [createStep(1), createStep(2), createStep(3), createStep(4)];

        render(<RecipePreparationSteps recipe={createRecipe(steps)} />);

        const progressBar = screen.getByRole("progressbar");

        expect(progressBar).toHaveAttribute("aria-valuenow", "25");

        const stepThree = document.querySelector('[data-step-index="2"]');

        expect(stepThree).not.toBeNull();

        act(() => {
            intersectionObserverCallback?.(
                [
                    {
                        isIntersecting: true,
                        target: stepThree!,
                    } as IntersectionObserverEntry,
                ],
                {} as IntersectionObserver
            );
        });

        expect(screen.getByText("Krok 3 / 4")).toBeInTheDocument();
        expect(progressBar).toHaveAttribute("aria-valuenow", "75");
    });

    it("renders step notes", () => {
        const steps = [createStep(1)];

        render(<RecipePreparationSteps recipe={createRecipe(steps)} />);

        expect(screen.getByText("Notatka do kroku 1")).toBeInTheDocument();
    });

    it("disconnects the IntersectionObserver on unmount", () => {
        const steps = [createStep(1), createStep(2)];

        const { unmount } = render(<RecipePreparationSteps recipe={createRecipe(steps)} />);

        unmount();

        expect(mockDisconnect).toHaveBeenCalledTimes(1);
    });
    it("uses image dimensions from Sanity metadata", () => {
        const step = {
            ...createStep(1),
            image: {
                asset: {
                    _id: "image-1",
                    url: "https://example.com/image.jpg",
                    metadata: {
                        dimensions: {
                            width: 1600,
                            height: 1067,
                        },
                    },
                },
                alt: "Zdjęcie potrawy",
            },
        };

        render(<RecipePreparationSteps recipe={createRecipe([step])} />);

        const image = screen.getByAltText("Zdjęcie potrawy");
        expect(image).toHaveAttribute("width", "1600");
        expect(image).toHaveAttribute("height", "1067");
    });
    it("uses default image dimensions when Sanity metadata is missing", () => {
        const step = {
            ...createStep(1),
            image: {
                asset: {
                    _id: "image-1",
                    url: "https://example.com/image.jpg",
                },
                alt: "Zdjęcie potrawy",
            },
        };

        render(<RecipePreparationSteps recipe={createRecipe([step])} />);

        const image = screen.getByAltText("Zdjęcie potrawy");
        expect(image).toHaveAttribute("width", "1200");
        expect(image).toHaveAttribute("height", "800");
    });
});
