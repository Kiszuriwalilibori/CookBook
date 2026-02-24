import type {Rule} from 'sanity'

export default {
  name: 'recipeNotes',
  title: 'Recipe Note',
  type: 'document',
  fields: [
    {
      name: 'userEmail',
      title: 'User Email',
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
  indexes: [
    {fields: ['userEmail', 'recipe']}, // zapobiega duplikatom notatek tego samego użytkownika do tego samego przepisu
  ],
}
