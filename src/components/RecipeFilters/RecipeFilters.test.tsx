/*
 * Testy sprawdzają:
 * - czyszczenie filtrów po kliknięciu przycisku „Wyczyść”,
 * - wyczyszczenie zapamiętanego URL ostatnio odwiedzonych przepisów,
 * - brak nawigacji po wyczyszczeniu filtrów,
 * - przekazywanie zmian wartości pól filtrów do hooka useFilters,
 * - wyświetlanie błędów walidacji i blokowanie nawigacji przy niepoprawnych filtrach,
 * - zastosowanie poprawnych filtrów i nawigację do strony wyników wyszukiwania.
 */

import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import RecipeFilters from "./RecipeFilters";
import { useFilters, useCreateRecipeFilterFields } from "@/hooks";
import { LastRecipes } from "@/utils/LastRecipes";

import type { RecipeFilter } from "@/types";
import type { FilterField } from "@/hooks/useCreateRecipeFilterFields";
import type { FilterState, FilterValuesTypes } from "@/models/filters";

const mockRouterPush = jest.fn();
const mockClearFilters = jest.fn();
const mockHandleChange = jest.fn();
const mockApply = jest.fn();

const emptyFilters: FilterState = {
    title: "",
    cuisine: [],
    tags: [],
    dietary: [],
    products: [],
    status: [],
    kizia: false,
    "source.url": "",
    "source.book": "",
    "source.title": "",
    "source.author": "",
    "source.where": "",
};

interface MockFilterFieldRendererProps {
    field: FilterField;
    filters: FilterState;
    handleChange: (key: keyof FilterState, value: FilterValuesTypes) => void;
    getErrorProps: (key: keyof FilterState) => {
        error: boolean;
        helperText: string;
    };
}

const getInputValue = (value: FilterValuesTypes): string => {
    if (Array.isArray(value)) {
        return value.join(", ");
    }

    return String(value ?? "");
};

jest.mock("next/navigation", () => ({
    useRouter: () => ({
        push: mockRouterPush,
    }),
}));

jest.mock("@/utils/LastRecipes", () => ({
    LastRecipes: {
        clear: jest.fn(),
    },
}));

jest.mock("@/utils/searchRecipeByTitle", () => ({
    searchRecipeByTitle: jest.fn(),
}));

jest.mock("@/hooks", () => ({
    useFilters: jest.fn(),
    useCreateRecipeFilterFields: jest.fn(),
}));

jest.mock("@/hooks/useDelayedCondition", () => ({
    __esModule: true,
    default: () => false,
}));

jest.mock("./parts", () => {
    const React = jest.requireActual("react");

    return {
        FilterFieldRenderer: ({ field, filters, handleChange, getErrorProps }: MockFilterFieldRendererProps) => {
            const errorProps = getErrorProps(field.key);
            const value = filters[field.key];

            return React.createElement(
                "div",
                null,
                React.createElement("input", {
                    "aria-label": field.label,
                    value: getInputValue(value),
                    onChange: (event: React.ChangeEvent<HTMLInputElement>) => handleChange(field.key, event.target.value),
                    "aria-invalid": errorProps.error,
                }),
                errorProps.helperText ? React.createElement("span", null, errorProps.helperText) : null
            );
        },
        FilterSummary: () => null,
    };
});

const mockUseFilters = useFilters as jest.Mock;
const mockUseCreateRecipeFilterFields = useCreateRecipeFilterFields as jest.Mock;

describe("RecipeFilters", () => {
    beforeEach(() => {
        jest.clearAllMocks();

        mockApply.mockReturnValue(true);

        mockUseFilters.mockReturnValue({
            filters: emptyFilters,
            errors: {},
            handleChange: mockHandleChange,
            clear: mockClearFilters,
            apply: mockApply,
        });

        mockUseCreateRecipeFilterFields.mockReturnValue([
            {
                key: "title",
                label: "Tytuł",
                multiple: false,
                options: [],
                component: "autocomplete",
            },
            {
                key: "tags",
                label: "Tagi",
                multiple: true,
                options: [],
                component: "autocomplete",
            },
        ]);
    });

    it("clears filters and the last recipes URL without navigating", () => {
        render(<RecipeFilters options={{} as RecipeFilter} />);

        fireEvent.click(screen.getByRole("button", { name: /wyczyść/i }));

        expect(mockClearFilters).toHaveBeenCalledTimes(1);
        expect(LastRecipes.clear).toHaveBeenCalledTimes(1);
        expect(mockRouterPush).not.toHaveBeenCalled();
    });

    it("passes changed filter field values to useFilters", () => {
        render(<RecipeFilters options={{} as RecipeFilter} />);

        fireEvent.change(screen.getByRole("textbox", { name: "Tytuł" }), {
            target: { value: "Bigos" },
        });

        expect(mockHandleChange).toHaveBeenCalledWith("title", "Bigos");
    });

    it("displays validation errors and does not navigate when filters are invalid", async () => {
        mockApply.mockReturnValue(false);

        mockUseFilters.mockReturnValue({
            filters: emptyFilters,
            errors: {
                tags: "Maksymalnie 10 tagów",
            },
            handleChange: mockHandleChange,
            clear: mockClearFilters,
            apply: mockApply,
        });

        render(<RecipeFilters options={{} as RecipeFilter} />);

        expect(screen.getByText("Maksymalnie 10 tagów")).toBeInTheDocument();

        fireEvent.click(screen.getByRole("button", { name: /zastosuj/i }));

        await waitFor(() => {
            expect(mockApply).toHaveBeenCalledTimes(1);
        });

        expect(mockRouterPush).not.toHaveBeenCalled();
    });

    it("applies valid filters and navigates to the recipes results page", async () => {
        mockUseFilters.mockReturnValue({
            filters: {
                ...emptyFilters,
                cuisine: ["Gruzińska"],
            },
            errors: {},
            handleChange: mockHandleChange,
            clear: mockClearFilters,
            apply: mockApply,
        });

        render(<RecipeFilters options={{} as RecipeFilter} />);

        fireEvent.click(screen.getByRole("button", { name: /zastosuj/i }));

        await waitFor(() => {
            expect(mockRouterPush).toHaveBeenCalledWith("/recipes?cuisine=Gruzi%C5%84ska");
        });

        expect(mockApply).toHaveBeenCalledTimes(1);
    });
});
