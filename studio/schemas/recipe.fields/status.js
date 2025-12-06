import {StatusOptions} from '../../../src/types/index'

export default {
  name: 'status',
  title: 'Status',
  type: 'string',
  options: {list: StatusOptions},
  validation: (Rule) => Rule.required().error('Status is required'),
  initialValue: 'Good',
}
