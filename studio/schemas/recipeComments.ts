
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
      name: 'likesCount',
      type: 'number',
      initialValue: 0,
    },

    {
      name: 'likes',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {name: 'author', type: 'string'},
            {name: 'fingerprint', type: 'string'},
          ],
        },
      ],
      initialValue: [],
    },

    // 🧠 MODERATION STATUS
    {
      name: 'status',
      type: 'string',
      options: {
        list: [
          {title: 'Pending', value: 'pending'},
          {title: 'Approved', value: 'approved'},
          {title: 'Rejected', value: 'rejected'},
        ],
      },
      initialValue: 'pending',
      validation: (Rule: Rule) => Rule.required(),
    },

    {
      name: 'moderationScore',
      type: 'number',
    },

    {
      name: 'moderationReason',
      type: 'string',
    },
  ],
}