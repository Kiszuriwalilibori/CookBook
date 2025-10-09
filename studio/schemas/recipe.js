import ProductsInput from '../components/ProductsInput';


export default {
  name: 'recipe',
  title: 'Recipe',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Recipe Title',
      type: 'string',
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
    },
    {
      name: 'ingredients',
      title: 'Ingredients',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'name', title: 'Ingredient Name', type: 'string' },
            { name: 'quantity', title: 'Quantity', type: 'number' },
          ],
        },
      ],
    },
    {
      name: 'Products',
      title: 'Products',
      type: 'array',
      of: [{ type: 'string' }],
      components: {
        input: ProductsInput, // Custom component for dynamic updates
      },
      description: 'List of product names derived from the last word of each ingredient name',
      validation: Rule => Rule.unique(), // Optional: Ensure unique strings
    },
    {
      name: 'preparationSteps',
      title: 'Preparation Steps',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'Bold', value: 'strong' }, // Enable bold text
          ],
          marks: {
            decorators: [
              { title: 'Strong', value: 'strong' }, // Bold text
              { title: 'Emphasis', value: 'em' }, // Optional: italics
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
                    validation: Rule => Rule.uri({ scheme: ['http', 'https'] }),
                  },
                ],
              },
            ],
          },
        },
      ]
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
      name: 'dietaryRestrictions',
      title: 'Dietary Restrictions',
      type: 'array',
      of: [{ type: 'string' }],
    },
    {
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
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
      name: 'source',
      title: 'Source',
      type: 'object',
      fields: [
        { name: 'isInternet', title: 'Is Internet', type: 'boolean' },
        { name: 'http', title: 'HTTP', type: 'string' },
        { name: 'book', title: 'Book', type: 'string' },
        { name: 'title', title: 'Title', type: 'string' },
      ],
    },
  ],
};