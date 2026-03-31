import type {Rule} from 'sanity'

export default {
  name: 'ratings',
  title: 'Ratings',
  type: 'array',
  of: [
    {
      type: 'object',
      fields: [
        {
          name: 'rating',
          title: 'Rating',
          type: 'number',
          validation: (Rule: Rule) => Rule.required().min(1).max(5).integer(),
        },
        {
          name: 'fingerprint',
          title: 'Fingerprint',
          type: 'string',
          validation: (Rule: Rule) => Rule.required(),
        },
        {
          name: 'updatedAt',
          title: 'Updated At',
          type: 'datetime',
          validation: (Rule: Rule) => Rule.required(),
        },
      ],
      preview: {
        select: {
          rating: 'rating',
          fingerprint: 'fingerprint',
          updatedAt: 'updatedAt',
        },
        prepare({rating, fingerprint, updatedAt}: any) {
          return {
            title: `${rating}⭐`,
            subtitle: `${fingerprint?.slice(0, 8)} • ${new Date(updatedAt).toLocaleString(
              'pl-PL',
            )}`,
          }
        },
      },
    },
  ],
}
