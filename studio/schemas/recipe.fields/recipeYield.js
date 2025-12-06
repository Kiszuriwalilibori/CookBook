export default {
  name: 'recipeYield',
  title: 'Ilość porcji (Schema.org)',
  type: 'number',
  description: 'Liczba porcji – używana w Google Rich Results',
  validation: (Rule) => Rule.min(1).integer(),
}
