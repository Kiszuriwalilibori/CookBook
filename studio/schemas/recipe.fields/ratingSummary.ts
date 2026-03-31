export default {
  name: 'ratingSummary',
  title: 'Rating Summary',
  type: 'object',
  fields: [
    {
      name: 'average',
      title: 'Average Rating',
      type: 'number',
      readOnly: true,
    },
    {
      name: 'count',
      title: 'Ratings Count',
      type: 'number',
      readOnly: true,
    },
  ],
}
