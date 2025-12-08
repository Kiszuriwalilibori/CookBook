
export default {
  name: 'options',
  title: 'Options',
  type: 'document',
  fields: [
    {
      name: 'fullSummary',
      title: 'Full Summary',
      type: 'object',
      fields: [
        {
          name: 'products',
          title: 'Products',
          type: 'array',
          of: [{type: 'string'}],
        },
        {
          name: 'dietary',
          title: 'Dietary',
          type: 'array',
          of: [{type: 'string'}],
        },
        {
          name: 'cuisine',
          title: 'Cuisine',
          type: 'array',
          of: [{type: 'string'}],
        },
        {
          name: 'tags',
          title: 'Tags',
          type: 'array',
          of: [{type: 'string'}],
        },
        {
          name: 'title',
          title: 'Titles',
          type: 'array',
          of: [{type: 'string'}],
        },
        {
          name: 'source',
          title: 'Source',
          type: 'object',
          fields: [
            {name: 'url', type: 'array', of: [{type: 'string'}]},
            {name: 'book', type: 'array', of: [{type: 'string'}]},
            {name: 'title', type: 'array', of: [{type: 'string'}]},
            {name: 'author', type: 'array', of: [{type: 'string'}]},
            {name: 'where', type: 'array', of: [{type: 'string'}]},
          ],
        },
      ],
    },
    {
      name: 'goodSummary',
      title: 'Good / Acceptable Summary',
      type: 'object',
      fields: [
        {
          name: 'products',
          title: 'Products',
          type: 'array',
          of: [{type: 'string'}],
        },
        {
          name: 'dietary',
          title: 'Dietary',
          type: 'array',
          of: [{type: 'string'}],
        },
        {
          name: 'cuisine',
          title: 'Cuisine',
          type: 'array',
          of: [{type: 'string'}],
        },
        {
          name: 'tags',
          title: 'Tags',
          type: 'array',
          of: [{type: 'string'}],
        },
        {
          name: 'title',
          title: 'Titles',
          type: 'array',
          of: [{type: 'string'}],
        },
        {
          name: 'source',
          title: 'Source',
          type: 'object',
          fields: [
            {name: 'http', type: 'array', of: [{type: 'string'}]},
            {name: 'book', type: 'array', of: [{type: 'string'}]},
            {name: 'title', type: 'array', of: [{type: 'string'}]},
            {name: 'author', type: 'array', of: [{type: 'string'}]},
            {name: 'where', type: 'array', of: [{type: 'string'}]},
          ],
        },
      ],
    },
  ],
}
