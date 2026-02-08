import { Status } from ".";

interface PortableTextBlock {
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
            children?: Array<{ text: string }>;
        };
        content?: PortableTextBlock[];
        image?: {
            asset?: { _id: string; url?: string };
            alt?: string;
        };
        notes?: string;
    };

    ingredients?: Array<{
        name: string;
        quantity: number;
        unit?: string;
        excluded: boolean;
    }>;

    ingredientsNotes?: string;
    products?: string[];

    preparationSteps?: Array<{
        _key?: string;
        content?: PortableTextBlock[];
        image?: {
            asset?: { _id: string; url?: string };
            alt?: string;
        };
        notes?: string;
    }>;

    // Zostaje – do czasu przełączenia aplikacji
    calories?: number;
    prepTime?: number;
    cookTime?: number;
    recipeYield?: number;
    cuisine?: string[];
    dietary?: string[];
    tags?: string[];
    notes?: string;
    kizia?: boolean;
    status: Status;

    source?: {
        url?: string;
        book?: string;
        title?: string;
        author?: string;
        where?: string;
    };

    nutrition?: {
        per100g: {
            calories: number;
            protein: number;
            fat: number;
            carbohydrate: number;
        };
        totalWeight: number;
        micronutrients?: {
            vitaminA?: number;
            vitaminC?: number;
            vitaminD?: number;
            vitaminE?: number;
            vitaminK?: number;
            thiamin?: number;
            riboflavin?: number;
            niacin?: number;
            vitaminB6?: number;
            folate?: number;
            vitaminB12?: number;
            calcium?: number;
            iron?: number;
            magnesium?: number;
            potassium?: number;
            sodium?: number;
            zinc?: number;
            selenium?: number;
        };
        calculatedAt?: string;
    };
}