import ProductsInput from '../../components/ProductsInput'

export default {
  name: 'products',
  title: 'Products',
  type: 'array',
  of: [{type: 'string'}],
  components: {input: ProductsInput},
  description: 'List of product names derived from the last word of each ingredient name',
  validation: (Rule) => Rule.unique(),
}
