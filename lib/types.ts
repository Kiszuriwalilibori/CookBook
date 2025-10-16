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
  Products?: string[];
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
  difficulty?: 'łatwe' | 'trudne';
  dietaryRestrictions?: string[];
  tags?: string[];
  notes?: string;
  Kizia?: boolean;
  source?: {
    isInternet?: boolean;
    http?: string;
    book?: string;
    title?: string;
  };
}