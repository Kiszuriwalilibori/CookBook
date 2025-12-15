// // schema/fields/description.js
// export default {
//   name: 'description',
//   title: 'Description',
//   type: 'object',
//   fields: [
//     {
//       name: 'title',
//       title: 'Description Title',
//       type: 'string',
//       description: 'A short title for the description (e.g., "Recipe Overview")',
//     },
//     {
//       name: 'content',
//       title: 'Description Content',
//       type: 'array',
//       of: [
//         {
//           type: 'block',
//           styles: [
//             {title: 'Normal', value: 'normal'},
//             {title: 'Heading 1', value: 'h1'},
//             {title: 'Heading 2', value: 'h2'},
//             {title: 'Bold', value: 'strong'},
//             {title: 'List Item', value: 'bullet'},
//             {title: 'Numbered List Item', value: 'number'},
//           ],
//           marks: {
//             decorators: [
//               {title: 'Strong', value: 'strong'},
//               {title: 'Emphasis', value: 'em'},
//               {title: 'Underline', value: 'underline'},
//             ],
//             annotations: [
//               {
//                 name: 'link',
//                 type: 'object',
//                 title: 'Link',
//                 fields: [
//                   {
//                     name: 'href',
//                     type: 'url',
//                     title: 'URL',
//                     validation: (Rule) => Rule.uri({scheme: ['http', 'https']}),
//                   },
//                   {
//                     name: 'openInNewTab',
//                     title: 'Open in new tab?',
//                     type: 'boolean',
//                     initialValue: true,
//                   },
//                 ],
//               },
//             ],
//           },
//         },
//       ],
//       description: 'Detailed description of the recipe. Use lists for key features.',
//     },
//     {
//       name: 'image',
//       title: 'Description Image',
//       type: 'image',
//       options: {
//         hotspot: true,
//       },
//       fields: [
//         {
//           name: 'alt',
//           type: 'string',
//           title: 'Alternative text',
//           description: 'Important for accessibility',
//           options: {
//             isHighlighted: true,
//           },
//           validation: (Rule) => Rule.required().error('Alt text is required for images'),
//         },
//       ],
//     },
//     {
//       name: 'notes',
//       title: 'Additional Notes',
//       type: 'text',
//       rows: 2,
//       description: 'Optional tips or additional info for the description.',
//     },
//   ],
//   preview: {
//     select: {
//       title: 'title',
//       media: 'image',
//     },
//     prepare(selection) {
//       const {title, media} = selection
//       return {
//         title,
//         media,
//       }
//     },
//   },
// }

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
