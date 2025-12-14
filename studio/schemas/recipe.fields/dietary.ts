// export default {
//   name: 'dietary',
//   title: 'Dietary Restrictions',
//   type: 'array',
//   of: [{type: 'string'}],
// }

import DietaryInput from '../../components/DietaryInput'

export default {
  name: 'dietary',
  title: 'Dietary Restrictions',
  type: 'array',
  of: [{type: 'string'}],
  components: {input: DietaryInput},
}
