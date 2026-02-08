

// recipe.fields/nutrition.js
export default {
  name: 'nutrition',
  title: 'Wartości odżywcze (auto z API – na 100 g potrawy)',
  type: 'object',
  options: {
    collapsible: true,
    collapsed: true,
  },
  fields: [
   
    {
      name: 'per100g',
      title: 'Na 100 g',
      type: 'object',
      options: { collapsible: true, collapsed: false },
      fields: [
        { name: 'calories', title: 'Kalorie (kcal)', type: 'number'},
        { name: 'protein', title: 'Białko (g)', type: 'number' },
        { name: 'fat', title: 'Tłuszcz (g)', type: 'number' },
        { name: 'carbohydrate', title: 'Węglowodany (g)', type: 'number'},
      ],
    },

    // === Całkowita waga przepisu ===
    { name: 'totalWeight', title: 'Całkowita waga przepisu (g)', type: 'number'},

    // === Mikroskładniki (wszystkie zachowane – będą wypełniane później) ===
    {
      name: 'micronutrients',
      title: 'Mikroskładniki (% DV, chyba że zaznaczono inaczej)',
      type: 'object',
      options: { collapsible: true, collapsed: true },
      fields: [
        { name: 'vitaminA', title: 'Witamina A (% DV)', type: 'number'},
        { name: 'vitaminC', title: 'Witamina C (% DV)', type: 'number' },
        { name: 'vitaminD', title: 'Witamina D (% DV)', type: 'number' },
        { name: 'vitaminE', title: 'Witamina E (% DV)', type: 'number' },
        { name: 'vitaminK', title: 'Witamina K (% DV)', type: 'number' },
        { name: 'thiamin', title: 'Tiamina (B1) (% DV)', type: 'number'},
        { name: 'riboflavin', title: 'Ryboflawina (B2) (% DV)', type: 'number'},
        { name: 'niacin', title: 'Niacyna (B3) (% DV)', type: 'number' },
        { name: 'vitaminB6', title: 'Witamina B6 (% DV)', type: 'number' },
        { name: 'folate', title: 'Foliany (% DV)', type: 'number' },
        { name: 'vitaminB12', title: 'Witamina B12 (% DV)', type: 'number' },
        { name: 'calcium', title: 'Wapń (% DV)', type: 'number' },
        { name: 'iron', title: 'Żelazo (% DV)', type: 'number' },
        { name: 'magnesium', title: 'Magnez (% DV)', type: 'number' },
        { name: 'potassium', title: 'Potas (mg)', type: 'number' },
        { name: 'sodium', title: 'Sód (mg)', type: 'number' },
        { name: 'zinc', title: 'Cynk (% DV)', type: 'number' },
        { name: 'selenium', title: 'Selen (% DV)', type: 'number'},
      ],
    },

    // === Metadane ===
    { name: 'calculatedAt', title: 'Data obliczenia', type: 'datetime', hidden: true },
    { name: 'rawData', title: 'Raw data (cache)', type: 'text', hidden: true },
  ],
}