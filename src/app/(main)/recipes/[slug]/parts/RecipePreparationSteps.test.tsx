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

    it("updates the active step when IntersectionObserver detects another step", () => {
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
                        boundingClientRect: {
                            top: 120,
                        } as DOMRect,
                    } as IntersectionObserverEntry,
                ],
                {} as IntersectionObserver
            );
        });

        expect(screen.getByText("Krok 2 / 3")).toBeInTheDocument();
        expect(screen.queryByText("Krok 1 / 3")).not.toBeInTheDocument();
    });

    it("uses the step closest to the top when multiple steps are visible", () => {
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
                        boundingClientRect: {
                            top: 180,
                        } as DOMRect,
                    } as IntersectionObserverEntry,
                    {
                        isIntersecting: true,
                        target: stepThree!,
                        boundingClientRect: {
                            top: 100,
                        } as DOMRect,
                    } as IntersectionObserverEntry,
                ],
                {} as IntersectionObserver
            );
        });

        expect(screen.getByText("Krok 3 / 3")).toBeInTheDocument();
    });

    it("does not change the active step when no steps are intersecting", () => {
        const steps = [createStep(1), createStep(2)];

        render(<RecipePreparationSteps recipe={createRecipe(steps)} />);

        act(() => {
            intersectionObserverCallback?.(
                [
                    {
                        isIntersecting: false,
                        target: document.querySelector('[data-step-index="1"]')!,
                        boundingClientRect: {
                            top: 100,
                        } as DOMRect,
                    } as IntersectionObserverEntry,
                ],
                {} as IntersectionObserver
            );
        });

        expect(screen.getByText("Krok 1 / 2")).toBeInTheDocument();
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
                        boundingClientRect: {
                            top: 100,
                        } as DOMRect,
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
});
