export const recipeCardProjection = `
  _id,
  title,
  slug {
    current
  },
  description {
    title,
    firstBlockText,
    image {
      asset-> {
        url
      },
      alt
    }
  },
  prepTime,
  cookTime,
  recipeYield,
  tags,
  dietary,
  products,
  kizia,
  status
`;
