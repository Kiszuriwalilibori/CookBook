// lib/types.ts (updated to match query's firstBlockText structure)
export interface PortableTextBlock {
    _key: string;
    _type: "block";
    style: string;
    children: Array<{
        _key: string;
        _type: "span";
        marks: string[];
        text: string;
    }>;
    markDefs?: Array<{
        _key: string;
        _type: "link";
        href: string;
        openInNewTab?: boolean;
    }>; // Expand for other annotations as needed
}

export interface Recipe {
    _id: string;
    title: string;
    slug?: {
        current: string;
    };
    description?: {
        title?: string;
        firstBlockText?: {
            children?: Array<{
                text: string;
            }>;
        };
        content?: PortableTextBlock[];
        image?: {
            asset?: {
                _id: string;
                url?: string;
            };
            alt?: string;
        };
        notes?: string;
    };
    ingredients?: Array<{
        name: string;
        quantity: number;
    }>;
    products?: string[];
    preparationSteps?: Array<{
        _key?: string; //
        content?: PortableTextBlock[];
        image?: {
            asset?: {
                _id: string;
                url?: string;
            };
            alt?: string;
        };
        notes?: string;
    }>;
    calories?: number;
    preparationTime?: number;
    cookingTime?: number;
    servings?: number;
    cuisine?: string;
    dietary?: string[];
    tags?: string[];
    notes?: string;
    Kizia?: boolean;
    source?: {
        http?: string;
        book?: string;
        title?: string;
        author: string;
        where?: string;
    };
}

export const fieldTranslations: Record<string, string> = {
    title: "Nazwa",
    calories: "Kalorie",
    cookingTime: "Czas aktywnej pracy",
    dietary: "Rodzaj diety",
    tags: "Etykiety",
    cuisine: "Kuchnia",
    preparationTime: "Całkowity czas przygotowania",
    servings: "Porcje", // Not used directly; handled dynamically below
    notes: "Notatki",
    product: "Produkt",
};
