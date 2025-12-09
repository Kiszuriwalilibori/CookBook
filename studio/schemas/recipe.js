
// recipe.js
import cookTime from './recipe.fields/cookTime'
import cuisine from './recipe.fields/cuisine'
import description from './recipe.fields/description'
import dietary from './recipe.fields/dietary'
import ingredients from './recipe.fields/ingredients'
import kizia from './recipe.fields/kizia'
import notes from './recipe.fields/notes'
import nutrition from './recipe.fields/nutrition'
import preparationSteps from './recipe.fields/preparationSteps'
import prepTime from './recipe.fields/prepTime'
import products from './recipe.fields/products'
import slug from './recipe.fields/slug'
import source from './recipe.fields/source'
import status from './recipe.fields/status'
import title from './recipe.fields/title'
import tags from './recipe.fields/tags'
import recipeYield from './recipe.fields/recipeYield'

export default {
  name: 'recipe',
  title: 'Recipe',
  type: 'document',
  fields: [
    title,
    slug,
    description,
    ingredients,
    products,
    preparationSteps,
    prepTime,
    cookTime,
    recipeYield,
    cuisine,
    dietary,
    tags,
    notes,
    kizia,
    status,
    source,
    nutrition,
  ],
}

// todo: add SEO fields,add jsDoc for files
// Przeczytać dokłądnie bestPractices for recipeSchemas w GROK redefinicja recipe.js
// w sumie fajnie by było wykorzystać polish translations
