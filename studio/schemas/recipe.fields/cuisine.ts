import CuisineInput from '../../components/CuisineInput'
import {getTranslation} from '../../../src/models/fieldTranslations'

export default {
  name: 'cuisine',
  title: getTranslation('cuisine'),
  type: 'array',
  of: [{type: 'string'}],
  components: {input: CuisineInput},
}
