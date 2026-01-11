// sanity/schemas/favorite.ts
export default {
  name: 'favorite',
  title: 'Favorite',
  type: 'document',
  fields: [
    {
      name: 'userId',
      title: 'User ID',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'recipe',
      title: 'Recipe',
      type: 'reference',
      to: [{type: 'recipe'}],
      validation: (Rule) => Rule.required(),
    },
  ],
  indexes: [
    {fields: ['userId', 'recipe']}, // zapobiega duplikatom
  ],
}
