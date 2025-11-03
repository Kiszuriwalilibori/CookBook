
export default {
  name: 'recipesSummary',
  title: 'Recipes Summary',
  type: 'document',
  fields: [
    {name: 'totalCount', type: 'number', title: 'Total Recipes'},
    {name: 'categories', type: 'array', title: 'Categories', of: [{type: 'string'}]},
    // Add more aggregation fields as needed
  ],
}
