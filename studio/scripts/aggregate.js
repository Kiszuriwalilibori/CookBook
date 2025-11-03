import sanityClient from '@sanity/client'

const client = sanityClient({
  projectId: 'YOUR_PROJECT_ID',
  dataset: 'production',
  token: 'YOUR_WRITE_TOKEN', // Needs write permissions
  useCdn: false,
})

async function updateSummary() {
  const recipes = await client.fetch('*[_type == "recipe"]')
  // Example aggregation
  const totalCount = recipes.length
  const categories = Array.from(new Set(recipes.flatMap((r) => r.categories ?? [])))

  // Upsert the summary document (use a known, fixed _id)
  await client.createOrReplace({
    _id: 'recipes-summary',
    _type: 'recipesSummary',
    totalCount,
    categories,
  })
}

updateSummary()
