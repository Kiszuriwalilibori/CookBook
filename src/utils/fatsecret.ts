

// src/utils/fatsecret.ts
import crypto from 'crypto'

interface Ingredient {
  name: string
  quantity: number
  unit?: string
  excluded: boolean
}

interface Serving {
  calories?: string
  protein?: string
  fat?: string
  carbohydrate?: string
  metric_serving_amount?: string
  metric_serving_unit?: string
  number_of_units?: string
  serving_description?: string
}

export interface NutritionPer100gResult {
  per100g: {
    calories: number
    protein: number
    fat: number
    carbohydrate: number
  }
  totalWeight: number
}

const CONSUMER_KEY = process.env.FATSECRET_CONSUMER_KEY!
const CONSUMER_SECRET = process.env.FATSECRET_CONSUMER_SECRET!

function signRequest(params: Record<string, string>, method: string, url: string): string {
  // 1. Sortuj parametry alfabetycznie i koduj
  const sortedParams = Object.keys(params)
    .sort()
    .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`)
    .join('&')
  
  // 2. Buduj base string
  const baseString = `${method.toUpperCase()}&${encodeURIComponent(url)}&${encodeURIComponent(sortedParams)}`
  
  // 3. Loguj do debuga (usuń później)
  console.log('DEBUG: Base String:', baseString)
  console.log('DEBUG: Signing Key:', CONSUMER_SECRET + '&')

  // 4. Podpisz HMAC-SHA1
  const key = `${CONSUMER_SECRET}&`
  const hmac = crypto.createHmac('sha1', key)
  hmac.update(baseString)
  const signature = hmac.digest('base64')
  
  console.log('DEBUG: Generated Signature:', signature)
  return signature
}

export async function calculateNutritionFromIngredients(
  ingredients: Ingredient[]
): Promise<NutritionPer100gResult> {
  const included = ingredients.filter(i => !i.excluded && i.name?.trim())
  const total = {
    calories: 0,
    protein: 0,
    fat: 0,
    carbohydrate: 0,
    totalWeight: 0,
  }

  for (const ing of included) {
    const query = `${ing.quantity} ${ing.unit || ''} ${ing.name}`.trim()

    const searchParams: Record<string, string> = {
      method: 'foods.search.v4',
      search_expression: query,
      format: 'json',
      oauth_consumer_key: CONSUMER_KEY,
      oauth_nonce: Math.random().toString(36).substring(2),
      oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
      oauth_signature_method: 'HMAC-SHA1',
      oauth_version: '1.0',
    }

    searchParams.oauth_signature = signRequest(searchParams, 'POST', 'https://platform.fatsecret.com/rest/server.api')

    // Loguj pełne parametry do debuga
    console.log('DEBUG: Full Search Params:', searchParams)

    const searchRes = await fetch('https://platform.fatsecret.com/rest/server.api', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(searchParams),
    })

    console.log('DEBUG: FatSecret Response Status:', searchRes.status)

    if (!searchRes.ok) {
      console.error('DEBUG: FatSecret Error Response:', await searchRes.text())
      continue
    }

    const searchData = await searchRes.json()
    console.log('DEBUG: Search Data Keys:', Object.keys(searchData))

    const food = Array.isArray(searchData.foods?.food)
      ? searchData.foods.food[0]
      : searchData.foods?.food

    if (!food?.food_id) {
      console.log('DEBUG: No food_id found for query:', query)
      continue
    }

    console.log('DEBUG: Found Food ID:', food.food_id)

    // Pobieramy szczegóły
    const detailParams: Record<string, string> = {
      ...searchParams,
      method: 'food.get.v5',
      food_id: food.food_id,
    }
    detailParams.oauth_signature = signRequest(detailParams, 'POST', 'https://platform.fatsecret.com/rest/server.api')

    const detailRes = await fetch('https://platform.fatsecret.com/rest/server.api', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(detailParams),
    })

    if (!detailRes.ok) {
      console.error('DEBUG: Detail Error Status:', detailRes.status, await detailRes.text())
      continue
    }

    const detailData = await detailRes.json()
    const servings: Serving[] = Array.isArray(detailData.food.servings.serving)
      ? detailData.food.servings.serving
      : [detailData.food.servings.serving].filter(Boolean)

    const bestServing =
      servings.find(s => s.serving_description?.toLowerCase().includes((ing.unit || '').toLowerCase())) ||
      servings.find(s => s.serving_description?.includes('100 g')) ||
      servings[0]

    if (!bestServing) {
      console.log('DEBUG: No serving found for:', query)
      continue
    }

    console.log('DEBUG: Best Serving for', query, ':', bestServing.serving_description, bestServing.metric_serving_amount, 'g')

    const gramsPerUnit = parseFloat(bestServing.metric_serving_amount || '100')
    const unitsInQuery = parseFloat(bestServing.number_of_units || '1')
    const factor = ing.quantity * unitsInQuery

    total.calories += parseFloat(bestServing.calories || '0') * factor
    total.protein += parseFloat(bestServing.protein || '0') * factor
    total.fat += parseFloat(bestServing.fat || '0') * factor
    total.carbohydrate += parseFloat(bestServing.carbohydrate || '0') * factor
    total.totalWeight += gramsPerUnit * factor

    console.log('DEBUG: Added to total:', query, 'kcal:', parseFloat(bestServing.calories || '0') * factor, 'g:', gramsPerUnit * factor)
  }

  console.log('DEBUG: Final Total Weight:', total.totalWeight)

  // Zwracamy wartości NA 100 g + całkowitą wagę
  const weight = total.totalWeight > 0 ? total.totalWeight : 1

  return {
    per100g: {
      calories: Math.round((total.calories / weight) * 100),
      protein: Number(((total.protein / weight) * 100).toFixed(1)),
      fat: Number(((total.fat / weight) * 100).toFixed(1)),
      carbohydrate: Number(((total.carbohydrate / weight) * 100).toFixed(1)),
    },
    totalWeight: Math.round(weight),
  }
}