export default {
  name: 'summary',
  title: 'Summary',
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
      name: 'cuisine',
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
      name: 'title',
      title: 'Titles',
      type: 'array',
      of: [{type: 'string'}],
      description: 'Unique titles (first letter capitalized) aggregated from all recipes',
    },
  ],
}
