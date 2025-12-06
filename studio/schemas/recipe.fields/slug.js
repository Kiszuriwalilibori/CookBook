export default {
  name: 'slug',
  title: 'Slug',
  type: 'slug',
  options: {source: 'title', maxLength: 96},
  validation: (Rule) => Rule.required().error('Slug is required'),
}
