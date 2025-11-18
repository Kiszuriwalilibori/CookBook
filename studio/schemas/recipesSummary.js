export default {
  name: 'recipesSummary',
  title: 'Recipes Summary',
  type: 'document',
  fields: [
    {
      name: 'totalCount',
      title: 'Total Recipes',
      type: 'number',
    },
    {
      name: 'products',
      title: 'Products',
      type: 'array',
      of: [{type: 'string'}],
      description: 'Unique lowercased product names aggregated from all recipes',
    },
    {
      name: 'dietary',
      title: 'Dietary Restrictions',
      type: 'array',
      of: [{type: 'string'}],
      description: 'Unique lowercased dietary restriction values aggregated from all recipes',
    },
    {
      name: 'cuisines',
      title: 'Cuisines',
      type: 'array',
      of: [{type: 'string'}],
      description: 'Unique lowercased cuisine values aggregated from all recipes',
    },
    {
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{type: 'string'}],
      description: 'Unique lowercased tags aggregated from all recipes',
    },
    {
      name: 'titles',
      title: 'Titles',
      type: 'array',
      of: [{type: 'string'}],
      description: 'Unique titles (first letter capitalized) aggregated from all recipes',
    },
    {
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [{type: 'string'}],
      description:
        'Optional: alias for cuisines or other category grouping; included for backward compatibility',
    },
  ],
}
