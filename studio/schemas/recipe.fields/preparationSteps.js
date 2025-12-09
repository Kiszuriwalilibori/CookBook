// recipe.fields/preparationSteps.js

export default {
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
          options: {hotspot: true},
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alternative text',
              description: 'Important for accessibility',
              options: {isHighlighted: true},
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

      // Czysty, sprawdzony preview – pokazuje pierwszy akapit tekstu + zdjęcie
      preview: {
        select: {
          content: 'content',
          image: 'image',
        },
        prepare({content, image}) {
          let text = ''
          if (Array.isArray(content)) {
            const firstBlock = content.find((b) => b._type === 'block' && b.children)
            if (firstBlock) {
              text = firstBlock.children
                .filter((c) => c._type === 'span')
                .map((c) => c.text)
                .join('')
            }
          }
          if (text.length > 120) text = text.slice(0, 120).trim() + '…'

          return {
            title: text || '(pusty krok)',
            media: image,
          }
        },
      },
    },
  ],
  options: {
    sortable: true, // tylko drag & drop – działa idealnie
    collapsible: true,
  },
}
