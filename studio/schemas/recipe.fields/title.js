export default {
  name: 'title',
  title: 'Recipe Title',
  type: 'string',
  validation: (Rule) => Rule.required().error('Title is required'),
}
