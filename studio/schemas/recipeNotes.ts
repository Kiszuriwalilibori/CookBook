import type {Rule} from 'sanity'

export default {
  name: 'recipeNotes',
  title: 'Private Recipe Note',
  type: 'document',
  validation: (Rule: Rule) => Rule.max(200), // np. max 2000 znaków
  fields: [
    {
      name: 'userId',
      title: 'User ID',
      type: 'string',
      validation: (Rule: Rule) => Rule.required(),
    },
    {
      name: 'recipe',
      title: 'Recipe',
      type: 'reference',
      to: [{type: 'recipe'}],
      validation: (Rule: Rule) => Rule.required(),
    },
    {
      name: 'notes',
      title: 'Notes',
      type: 'text',
      description: 'Notatki użytkownika do przepisu (odpowiada polu notes w Recipe)',
    },
  ],
  indexes: [{fields: ['userId', 'recipe']}],
}
