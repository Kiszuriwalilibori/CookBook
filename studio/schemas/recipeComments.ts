import type {Rule} from 'sanity'

export default {
  name: 'recipeComment',
  title: 'Recipe Comment',
  type: 'document',

  fields: [
    {
      name: 'recipeId',
      type: 'string',
      validation: (Rule: Rule) => Rule.required(),
    },

    // 🔥 FLAT MODEL KEY FIELD
    {
      name: 'parentId',
      type: 'string',
      description: 'null = root comment, otherwise ID of parent comment',
    },

    {
      name: 'content',
      type: 'text',
      validation: (Rule: Rule) => Rule.required(),
    },

    {
      name: 'author',
      type: 'string',
      validation: (Rule: Rule) => Rule.required(),
    },
    {
      name: 'isAdmin',
      type: 'boolean',
      initialValue: false,
    },

    {
      name: 'createdAt',
      type: 'datetime',
      validation: (Rule: Rule) => Rule.required(),
    },

    {
      name: 'fingerprint',
      type: 'string',
      validation: (Rule: Rule) => Rule.required(),
    },

    {
      name: 'likes',
      type: 'array',
      of: [{type: 'string'}], // 👈 fingerprint only
      initialValue: [],
    },

    {
      name: 'shortComment',
      title: 'Short Comment',
      type: 'object',
      fields: [
        {
          name: 'content',
          type: 'string',
        },
        {
          name: 'createdAt',
          type: 'datetime',
        },
      ],
    },
  ],
}
