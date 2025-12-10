// // recipe.fields/nutrition.js
// export default {
//   name: 'nutrition',
//   title: 'Wartości odżywcze (auto z API)',
//   type: 'object',
//   options: {
//     collapsible: true,
//     collapsed: true,
//   },
//   fields: [
//     {name: 'calories', title: 'Kalorie (kcal)', type: 'number', readOnly: true},
//     {name: 'protein', title: 'Białko (g)', type: 'number', readOnly: true},
//     {name: 'fat', title: 'Tłuszcz (g)', type: 'number', readOnly: true},
//     {name: 'carbohydrate', title: 'Węglowodany (g)', type: 'number', readOnly: true},
//     {name: 'totalWeight', title: 'Całkowita waga (g)', type: 'number', readOnly: true},

//     {name: 'vitaminA', title: 'Witamina A (% DV)', type: 'number', readOnly: true},
//     {name: 'vitaminC', title: 'Witamina C (% DV)', type: 'number', readOnly: true},
//     {name: 'vitaminD', title: 'Witamina D (% DV)', type: 'number', readOnly: true},
//     {name: 'vitaminE', title: 'Witamina E (% DV)', type: 'number', readOnly: true},
//     {name: 'vitaminK', title: 'Witamina K (% DV)', type: 'number', readOnly: true},
//     {name: 'thiamin', title: 'Tiamina (B1) (% DV)', type: 'number', readOnly: true},
//     {name: 'riboflavin', title: 'Ryboflawina (B2) (% DV)', type: 'number', readOnly: true},
//     {name: 'niacin', title: 'Niacyna (B3) (% DV)', type: 'number', readOnly: true},
//     {name: 'vitaminB6', title: 'Witamina B6 (% DV)', type: 'number', readOnly: true},
//     {name: 'folate', title: 'Foliany (% DV)', type: 'number', readOnly: true},
//     {name: 'vitaminB12', title: 'Witamina B12 (% DV)', type: 'number', readOnly: true},
//     {name: 'calcium', title: 'Wapń (% DV)', type: 'number', readOnly: true},
//     {name: 'iron', title: 'Żelazo (% DV)', type: 'number', readOnly: true},
//     {name: 'magnesium', title: 'Magnez (% DV)', type: 'number', readOnly: true},
//     {name: 'potassium', title: 'Potas (mg)', type: 'number', readOnly: true},
//     {name: 'sodium', title: 'Sód (mg)', type: 'number', readOnly: true},
//     {name: 'zinc', title: 'Cynk (% DV)', type: 'number', readOnly: true},
//     {name: 'selenium', title: 'Selen (% DV)', type: 'number', readOnly: true},
//     {name: 'calculatedAt', title: 'Data obliczenia', type: 'datetime', hidden: true},
//     {name: 'rawData', title: 'Raw data (cache)', type: 'text', hidden: true},
//   ],
// }

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
    // === NA 100 g gotowej potrawy (główne makro) ===
    {
      name: 'per100g',
      title: 'Na 100 g',
      type: 'object',
      options: { collapsible: true, collapsed: false },
      fields: [
        { name: 'calories', title: 'Kalorie (kcal)', type: 'number', readOnly: true },
        { name: 'protein', title: 'Białko (g)', type: 'number', readOnly: true },
        { name: 'fat', title: 'Tłuszcz (g)', type: 'number', readOnly: true },
        { name: 'carbohydrate', title: 'Węglowodany (g)', type: 'number', readOnly: true },
      ],
    },

    // === Całkowita waga przepisu ===
    { name: 'totalWeight', title: 'Całkowita waga przepisu (g)', type: 'number', readOnly: true },

    // === Mikroskładniki (wszystkie zachowane – będą wypełniane później) ===
    {
      name: 'micronutrients',
      title: 'Mikroskładniki (% DV, chyba że zaznaczono inaczej)',
      type: 'object',
      options: { collapsible: true, collapsed: true },
      fields: [
        { name: 'vitaminA', title: 'Witamina A (% DV)', type: 'number', readOnly: true },
        { name: 'vitaminC', title: 'Witamina C (% DV)', type: 'number', readOnly: true },
        { name: 'vitaminD', title: 'Witamina D (% DV)', type: 'number', readOnly: true },
        { name: 'vitaminE', title: 'Witamina E (% DV)', type: 'number', readOnly: true },
        { name: 'vitaminK', title: 'Witamina K (% DV)', type: 'number', readOnly: true },
        { name: 'thiamin', title: 'Tiamina (B1) (% DV)', type: 'number', readOnly: true },
        { name: 'riboflavin', title: 'Ryboflawina (B2) (% DV)', type: 'number', readOnly: true },
        { name: 'niacin', title: 'Niacyna (B3) (% DV)', type: 'number', readOnly: true },
        { name: 'vitaminB6', title: 'Witamina B6 (% DV)', type: 'number', readOnly: true },
        { name: 'folate', title: 'Foliany (% DV)', type: 'number', readOnly: true },
        { name: 'vitaminB12', title: 'Witamina B12 (% DV)', type: 'number', readOnly: true },
        { name: 'calcium', title: 'Wapń (% DV)', type: 'number', readOnly: true },
        { name: 'iron', title: 'Żelazo (% DV)', type: 'number', readOnly: true },
        { name: 'magnesium', title: 'Magnez (% DV)', type: 'number', readOnly: true },
        { name: 'potassium', title: 'Potas (mg)', type: 'number', readOnly: true },
        { name: 'sodium', title: 'Sód (mg)', type: 'number', readOnly: true },
        { name: 'zinc', title: 'Cynk (% DV)', type: 'number', readOnly: true },
        { name: 'selenium', title: 'Selen (% DV)', type: 'number', readOnly: true },
      ],
    },

    // === Metadane ===
    { name: 'calculatedAt', title: 'Data obliczenia', type: 'datetime', hidden: true },
    { name: 'rawData', title: 'Raw data (cache)', type: 'text', hidden: true },
  ],
}