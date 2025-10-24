export default {
  name: 'index',
  title: 'Global Index',
  type: 'document',
  // Use a fixed ID to ensure only one instance exists
  __experimental_previews: {
    singlePreview: {
      prepare() {
        return {
          title: 'Global Recipe Index',
        }
      },
    },
  },
  fields: [
    {
      name: 'titles',
      title: 'Unique Recipe Titles',
      type: 'array',
      of: [{type: 'string'}],
      description: 'All unique recipe titles across all recipes.',
      readOnly: true, // Prevent manual edits
    },
    {
      name: 'tags',
      title: 'Unique Tags',
      type: 'array',
      of: [{type: 'string'}],
      description: 'All unique tags from all recipes.',
      readOnly: true,
    },
    {
      name: 'ingredients',
      title: 'Unique Ingredients',
      type: 'array',
      of: [{type: 'string'}],
      description: 'All unique ingredient names (from the `name` field) across all recipes.',
      readOnly: true,
    },
    {
      name: 'dietaryRestrictions',
      title: 'Unique Dietary Restrictions',
      type: 'array',
      of: [{type: 'string'}],
      description: 'All unique dietary restrictions across all recipes.',
      readOnly: true,
    },
    {
      name: 'cuisines',
      title: 'Unique Cuisine Types',
      type: 'array',
      of: [{type: 'string'}],
      description: 'All unique cuisine types across all recipes.',
      readOnly: true,
    },
    // Optional: Add a lastUpdated timestamp
    {
      name: 'lastUpdated',
      title: 'Last Updated',
      type: 'datetime',
      readOnly: true,
    },
  ],
}
