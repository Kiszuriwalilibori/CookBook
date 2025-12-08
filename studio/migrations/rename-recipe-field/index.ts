import {defineMigration, at, setIfMissing, unset} from 'sanity/migrate'

const from = 'http'
const to = 'url'

export default defineMigration({
  title: 'Rename recipe field',

  migrate: {
    document(doc, context) {
      return [at(to, setIfMissing(doc[from])), at(from, unset())]
    },
  },
})
