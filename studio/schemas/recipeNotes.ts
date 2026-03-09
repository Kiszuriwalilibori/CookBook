import type {Rule} from 'sanity'

export default {
  name: 'recipeNotes',
  title: 'Recipe Note',
  type: 'document',
  validation: (Rule: Rule) => Rule.max(200), // np. max 2000 znaków
  fields: [
    {
      name: 'userEmail',
      title: 'User Email',
      type: 'string',
      validation: (Rule: Rule) =>
        Rule.required().custom((value, context: any) => {
          if (!context.identity?.email) return true
          if (value !== context.identity.email) return 'You can only set your own email'
          return true
        }),
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
