// //recipe.js - schema for recipe document
// import {StatusOptions} from '../../src/types/index'
// import ProductsInput from '../components/ProductsInput'

// export default {
//   name: 'recipe',
//   title: 'Recipe',
//   type: 'document',
//   fields: [
//     {
//       name: 'title',
//       title: 'Recipe Title',
//       type: 'string',
//       validation: (Rule) => Rule.required().error('Title is required'),
//     },
//     {
//       name: 'slug',
//       title: 'Slug',
//       type: 'slug',
//       options: {
//         source: 'title',
//         maxLength: 96,
//       },
//       validation: (Rule) => Rule.required().error('Slug is required'),
//     },

//     {
//       name: 'description',
//       title: 'Description',
//       type: 'object',
//       fields: [
//         {
//           name: 'title',
//           title: 'Description Title',
//           type: 'string',
//           description: 'A short title for the description (e.g., "Recipe Overview")',
//         },
//         {
//           name: 'content',
//           title: 'Description Content',
//           type: 'array',
//           of: [
//             {
//               type: 'block',
//               styles: [
//                 {title: 'Normal', value: 'normal'},
//                 {title: 'Heading 1', value: 'h1'},
//                 {title: 'Heading 2', value: 'h2'},
//                 {title: 'Bold', value: 'strong'},
//                 {title: 'List Item', value: 'bullet'},
//                 {title: 'Numbered List Item', value: 'number'},
//               ],
//               marks: {
//                 decorators: [
//                   {title: 'Strong', value: 'strong'},
//                   {title: 'Emphasis', value: 'em'},
//                   {title: 'Underline', value: 'underline'},
//                 ],
//                 annotations: [
//                   {
//                     name: 'link',
//                     type: 'object',
//                     title: 'Link',
//                     fields: [
//                       {
//                         name: 'href',
//                         type: 'url',
//                         title: 'URL',
//                         validation: (Rule) => Rule.uri({scheme: ['http', 'https']}),
//                       },
//                       {
//                         name: 'openInNewTab',
//                         title: 'Open in new tab?',
//                         type: 'boolean',
//                         initialValue: true,
//                       },
//                     ],
//                   },
//                 ],
//               },
//             },
//           ],
//           description: 'Detailed description of the recipe. Use lists for key features.',
//         },
//         {
//           name: 'image',
//           title: 'Description Image',
//           type: 'image',
//           options: {
//             hotspot: true,
//           },
//           fields: [
//             {
//               name: 'alt',
//               type: 'string',
//               title: 'Alternative text',
//               description: 'Important for accessibility',
//               options: {
//                 isHighlighted: true,
//               },
//               validation: (Rule) => Rule.required().error('Alt text is required for images'),
//             },
//           ],
//         },
//         {
//           name: 'notes',
//           title: 'Additional Notes',
//           type: 'text',
//           rows: 2,
//           description: 'Optional tips or additional info for the description.',
//         },
//       ],
//       preview: {
//         select: {
//           title: 'title',
//           media: 'image',
//         },
//         prepare(selection) {
//           const {title, media} = selection
//           return {
//             title,
//             media,
//           }
//         },
//       },
//     },

//     {
//       name: 'ingredients',
//       title: 'Składniki',
//       type: 'array',
//       of: [
//         {
//           type: 'object',
//           name: 'ingredient',
//           title: 'Składnik',
//           fields: [
//             {name: 'quantity', title: 'Ilość', type: 'number'},
//             {name: 'unit', title: 'Jednostka miary', type: 'string'},
//             {
//               name: 'name',
//               title: 'Nazwa składnika',
//               type: 'string',
//               validation: (Rule) => Rule.required(),
//             },
//           ],
//           preview: {
//             select: {
//               quantity: 'quantity',
//               unit: 'unit',
//               name: 'name',
//             },
//             prepare({quantity, unit, name}) {
//               const parts = []

//               // Ilość – obsługa liczb dziesiętnych i całkowitych
//               if (quantity !== null && quantity !== undefined) {
//                 const qty = Number(quantity)
//                 if (!isNaN(qty)) {
//                   // Opcjonalnie: zamiana . na przecinek dla polskiego stylu
//                   const formatted = qty % 1 === 0 ? qty : qty.toString().replace('.', ',')
//                   parts.push(formatted)
//                 }
//               }

//               // Jednostka
//               if (unit) parts.push(unit)

//               // Nazwa składnika (zawsze na końcu)
//               if (name) parts.push(name)

//               return {
//                 title: parts.join(' ') || '— brak danych —',
//               }
//             },
//           },
//         },
//       ],
//     },
//     {
//       name: 'products',
//       title: 'Products',
//       type: 'array',
//       of: [{type: 'string'}],
//       components: {
//         input: ProductsInput, // Custom component for dynamic updates
//       },
//       description: 'List of product names derived from the last word of each ingredient name',
//       validation: (Rule) => Rule.unique(), // Optional: Ensure unique strings
//     },

//     {
//       name: 'preparationSteps',
//       title: 'Preparation Steps',
//       type: 'array',
//       of: [
//         {
//           type: 'object',
//           title: 'Step',
//           fields: [
//             {
//               name: 'content',
//               title: 'Step Content',
//               type: 'array',
//               of: [
//                 {
//                   type: 'block',
//                   styles: [
//                     {title: 'Normal', value: 'normal'},
//                     {title: 'Heading 1', value: 'h1'},
//                     {title: 'Heading 2', value: 'h2'},
//                     {title: 'Bold', value: 'strong'},
//                     {title: 'List Item', value: 'bullet'},
//                     {title: 'Numbered List Item', value: 'number'},
//                   ],
//                   marks: {
//                     decorators: [
//                       {title: 'Strong', value: 'strong'},
//                       {title: 'Emphasis', value: 'em'},
//                       {title: 'Underline', value: 'underline'},
//                     ],
//                     annotations: [
//                       {
//                         name: 'link',
//                         type: 'object',
//                         title: 'Link',
//                         fields: [
//                           {name: 'href', type: 'url', title: 'URL'},
//                           {
//                             name: 'openInNewTab',
//                             title: 'Open in new tab?',
//                             type: 'boolean',
//                             initialValue: true,
//                           },
//                         ],
//                       },
//                     ],
//                   },
//                 },
//               ],
//             },
//             {
//               name: 'image',
//               title: 'Step Image',
//               type: 'image',
//               options: {hotspot: true},
//               fields: [
//                 {
//                   name: 'alt',
//                   type: 'string',
//                   title: 'Alternative text',
//                   validation: (Rule) => Rule.required().error('Alt text is required for images'),
//                 },
//               ],
//             },
//             {
//               name: 'notes',
//               title: 'Additional Notes',
//               type: 'text',
//               rows: 2,
//             },
//           ],

//           // ← Czysty, bezpieczny preview – tylko tekst + zdjęcie
//           preview: {
//             select: {
//               content: 'content',
//               image: 'image',
//             },
//             prepare({content, image}) {
//               let text = ''
//               if (Array.isArray(content)) {
//                 const firstBlock = content.find((b) => b._type === 'block' && b.children)
//                 if (firstBlock) {
//                   text = firstBlock.children
//                     .filter((c) => c._type === 'span')
//                     .map((c) => c.text)
//                     .join('')
//                 }
//               }
//               if (text.length > 120) text = text.slice(0, 120).trim() + '…'

//               return {
//                 title: text || '(pusty krok)',
//                 media: image,
//               }
//             },
//           },
//         },
//       ],
//       options: {
//         sortable: true,
//       },
//     },
//     {
//       name: 'preparationTime',
//       title: 'Preparation Time',
//       type: 'number',
//       description: 'Time in minutes',
//     },
//     {
//       name: 'cookingTime',
//       title: 'Cooking Time',
//       type: 'number',
//       description: 'Time in minutes',
//     },
//     {
//       name: 'servings',
//       title: 'Servings',
//       type: 'number',
//     },
//     {
//       name: 'cuisine',
//       title: 'Cuisine Type',
//       type: 'string',
//     },

//     {
//       name: 'dietary',
//       title: 'Dietary Restrictions',
//       type: 'array',
//       of: [{type: 'string'}],
//     },
//     {
//       name: 'tags',
//       title: 'Tags',
//       type: 'array',
//       of: [{type: 'string'}],
//     },
//     {
//       name: 'notes',
//       title: 'Notes',
//       type: 'text',
//     },
//     {
//       name: 'kizia',
//       title: 'kizia',
//       type: 'boolean',
//     },
//     {
//       name: 'status',
//       title: 'Status',
//       type: 'string',
//       options: {
//         list: StatusOptions,
//       },
//       validation: (Rule) => Rule.required().error('Status is required'),
//       initialValue: 'Good',
//     },
//     {
//       name: 'source',
//       title: 'Source',
//       type: 'object',
//       fields: [
//         {name: 'http', title: 'HTTP', type: 'string'},
//         {name: 'book', title: 'Book', type: 'string'},
//         {name: 'title', title: 'Title', type: 'string'},
//         {name: 'author', title: 'Author', type: 'string'},
//         {name: 'where', title: 'Where', type: 'string'}, // Opcjonalne
//       ],
//     },
//   ],
// }

// recipe.js
import cookingTime from './recipe.fields/cookingTime'
import cuisine from './recipe.fields/cuisine'
import description from './recipe.fields/description'
import dietary from './recipe.fields/dietary'
import ingredients from './recipe.fields/ingredients'
import kizia from './recipe.fields/kizia'
import notes from './recipe.fields/notes'
import nutrition from './recipe.fields/nutrition'
import preparationSteps from './recipe.fields/preparationSteps'
import preparationTime from './recipe.fields/preparationTime'
import products from './recipe.fields/products'
import slug from './recipe.fields/slug'
import source from './recipe.fields/source'
import status from './recipe.fields/status'
import title from './recipe.fields/title'
import tags from './recipe.fields/tags'
import recipeYield from './recipe.fields/recipeYield'

export default {
  name: 'recipe',
  title: 'Recipe',
  type: 'document',
  fields: [
    title,
    slug,
    description,
    ingredients,
    products,
    preparationSteps,
    preparationTime,
    cookingTime,
    recipeYield,
    cuisine,
    dietary,
    tags,
    notes,
    kizia,
    status,
    source,
    nutrition,
  ],
}

// todo: add SEO fields,add jsDoc for files
// Przeczytać dokłądnie bestPractices for recipeSchemas w GROK redefinicja recipe.js
