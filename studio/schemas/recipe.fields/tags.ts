import TagsInput from '../../components/TagsInput'
import {getTranslation} from '../../../src/models/fieldTranslations'

export default {
  name: 'tags',
  title: getTranslation('tags'),
  type: 'array',
  of: [{type: 'string'}],
  components: {input: TagsInput},
}
