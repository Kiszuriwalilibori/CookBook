//recipe.js - schema for recipe document

import ProductsInput from '../components/ProductsInput'

export default {
  name: 'recipe',
  title: 'Recipe',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Recipe Title',
      type: 'string',
      validation: (Rule) => Rule.required().error('Title is required'),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required().error('Slug is required'),
    },

    {
      name: 'description',
      title: 'Description',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Description Title',
          type: 'string',
          description: 'A short title for the description (e.g., "Recipe Overview")',
        },
        {
          name: 'content',
          title: 'Description Content',
          type: 'array',
          of: [
            {
              type: 'block',
              styles: [
                {title: 'Normal', value: 'normal'},
                {title: 'Heading 1', value: 'h1'},
                {title: 'Heading 2', value: 'h2'},
                {title: 'Bold', value: 'strong'},
                {title: 'List Item', value: 'bullet'},
                {title: 'Numbered List Item', value: 'number'},
              ],
              marks: {
                decorators: [
                  {title: 'Strong', value: 'strong'},
                  {title: 'Emphasis', value: 'em'},
                  {title: 'Underline', value: 'underline'},
                ],
                annotations: [
                  {
                    name: 'link',
                    type: 'object',
                    title: 'Link',
                    fields: [
                      {
                        name: 'href',
                        type: 'url',
                        title: 'URL',
                        validation: (Rule) => Rule.uri({scheme: ['http', 'https']}),
                      },
                      {
                        name: 'openInNewTab',
                        title: 'Open in new tab?',
                        type: 'boolean',
                        initialValue: true,
                      },
                    ],
                  },
                ],
              },
            },
          ],
          description: 'Detailed description of the recipe. Use lists for key features.',
        },
        {
          name: 'image',
          title: 'Description Image',
          type: 'image',
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alternative text',
              description: 'Important for accessibility',
              options: {
                isHighlighted: true,
              },
              validation: (Rule) => Rule.required().error('Alt text is required for images'),
            },
          ],
        },
        {
          name: 'notes',
          title: 'Additional Notes',
          type: 'text',
          rows: 2,
          description: 'Optional tips or additional info for the description.',
        },
      ],
      preview: {
        select: {
          title: 'title',
          media: 'image',
        },
        prepare(selection) {
          const {title, media} = selection
          return {
            title,
            media,
          }
        },
      },
    },
    {
      name: 'ingredients',
      title: 'Ingredients',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {name: 'name', title: 'Ingredient Name', type: 'string'},
            {name: 'quantity', title: 'Quantity', type: 'number'},
          ],
        },
      ],
    },
    {
      name: 'products',
      title: 'Products',
      type: 'array',
      of: [{type: 'string'}],
      components: {
        input: ProductsInput, // Custom component for dynamic updates
      },
      description: 'List of product names derived from the last word of each ingredient name',
      validation: (Rule) => Rule.unique(), // Optional: Ensure unique strings
    },
    {
      name: 'preparationSteps',
      title: 'Preparation Steps',
      type: 'array',
      of: [
        {
          type: 'object',
          title: 'Step',
          fields: [
            {
              name: 'content',
              title: 'Step Content',
              type: 'array',
              of: [
                {
                  type: 'block',
                  styles: [
                    {title: 'Normal', value: 'normal'},
                    {title: 'Heading 1', value: 'h1'},
                    {title: 'Heading 2', value: 'h2'},
                    {title: 'Bold', value: 'strong'},
                    {title: 'List Item', value: 'bullet'},
                    {title: 'Numbered List Item', value: 'number'},
                  ],
                  marks: {
                    decorators: [
                      {title: 'Strong', value: 'strong'},
                      {title: 'Emphasis', value: 'em'},
                      {title: 'Underline', value: 'underline'},
                    ],
                    annotations: [
                      {
                        name: 'link',
                        type: 'object',
                        title: 'Link',
                        fields: [
                          {
                            name: 'href',
                            type: 'url',
                            title: 'URL',
                            validation: (Rule) => Rule.uri({scheme: ['http', 'https']}),
                          },
                          {
                            name: 'openInNewTab',
                            title: 'Open in new tab?',
                            type: 'boolean',
                            initialValue: true,
                          },
                        ],
                      },
                    ],
                  },
                },
              ],
              description: 'Detailed instructions for this step. Use lists for sub-steps.',
            },
            {
              name: 'image',
              title: 'Step Image',
              type: 'image',
              options: {
                hotspot: true,
              },
              fields: [
                {
                  name: 'alt',
                  type: 'string',
                  title: 'Alternative text',
                  description: 'Important for accessibility',
                  options: {
                    isHighlighted: true,
                  },
                  validation: (Rule) => Rule.required().error('Alt text is required for images'),
                },
              ],
            },
            {
              name: 'notes',
              title: 'Additional Notes',
              type: 'text',
              rows: 2,
              description: 'Optional tips or warnings for this step.',
            },
          ],
          preview: {
            select: {
              media: 'image',
            },
            prepare(selection) {
              const {media} = selection
              return {
                title: 'Preparation Step', // Fallback preview title
                media,
              }
            },
          },
          orderings: [
            {
              title: 'Step Order',
              name: 'stepOrder',
              by: [
                {fields: ['_createdAt'], direction: 'asc'}, // Order by creation time as fallback
              ],
            },
          ],
        },
      ],
      options: {
        reorder: {
          title: 'Reorder Steps',
        },
      },
    },
    {
      name: 'calories',
      title: 'Calories',
      type: 'number',
    },
    {
      name: 'preparationTime',
      title: 'Preparation Time',
      type: 'number',
      description: 'Time in minutes',
    },
    {
      name: 'cookingTime',
      title: 'Cooking Time',
      type: 'number',
      description: 'Time in minutes',
    },
    {
      name: 'servings',
      title: 'Servings',
      type: 'number',
    },
    {
      name: 'cuisine',
      title: 'Cuisine Type',
      type: 'string',
    },

    {
      name: 'dietary',
      title: 'Dietary Restrictions',
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
      name: 'notes',
      title: 'Notes',
      type: 'text',
    },
    {
      name: 'Kizia',
      title: 'Kizia',
      type: 'boolean',
    },
    {
      name: 'isReady',
      title: 'Is Ready',
      type: 'boolean',
      initialValue: true,
    },
    {
      name: 'source',
      title: 'Source',
      type: 'object',
      fields: [
        {name: 'http', title: 'HTTP', type: 'string'},
        {name: 'book', title: 'Book', type: 'string'},
        {name: 'title', title: 'Title', type: 'string'},
        {name: 'author', title: 'Author', type: 'string'},
        {name: 'where', title: 'Where', type: 'string'}, // Opcjonalne
      ],
    },
  ],
}
