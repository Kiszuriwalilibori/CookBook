import {getTranslation} from '../../../src/models/fieldTranslations'
import DietaryInput from '../../components/DietaryInput'

export default {
  name: 'dietary',
  title: getTranslation('dietary'),
  type: 'array',
  of: [{type: 'string'}],
  components: {input: DietaryInput},
}
