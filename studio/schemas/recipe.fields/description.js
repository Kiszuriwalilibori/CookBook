

// schema/fields/description.js
import DescriptionInput from '../../components/DescriptionInput'

export default {
  name: 'description',
  title: 'Description',
  type: 'object',
  components: {
    input: DescriptionInput,
  },
  fields: [
    {
      name: 'title',
      title: 'Description Title',
      type: 'string',
    },
    {
      name: 'content',
      title: 'Description Content',
      type: 'array',
      of: [{type: 'block'}],
    },
    {
      name: 'image',
      title: 'Description Image',
      type: 'image',
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alt text',
          validation: (Rule) => Rule.required(),
        },
      ],
    },
    {
      name: 'notes',
      title: 'Additional Notes',
      type: 'text',
      rows: 2,
    },
  ],
}
