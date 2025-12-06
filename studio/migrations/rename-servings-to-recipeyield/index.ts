import {defineMigration, at, setIfMissing, unset} from 'sanity/migrate'

const from = 'servings'
const to = 'recipeYield'

export default defineMigration({
  title: 'Rename servings to recipeYield',
  documentTypes: ["recipe"],

  migrate: {
    document(doc, context) {
      return [
        at(to, setIfMissing(doc[from])),
        at(from, unset())
      ]
    }
  }
})
