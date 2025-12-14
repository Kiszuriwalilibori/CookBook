// export default {
//   name: 'dietary',
//   title: 'Dietary Restrictions',
//   type: 'array',
//   of: [{type: 'string'}],
// }
import {getTranslation} from '../../../src/models/fieldTranslations'
import DietaryInput from '../../components/DietaryInput'

export default {
  name: 'dietary',
  title: getTranslation('dietary'),
  description: 'Liczba porcji uzyskiwana w przepisie',
  type: 'array',
  of: [{type: 'string'}],
  components: {input: DietaryInput},
}
