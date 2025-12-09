export default {
  name: 'ingredients',
  title: 'Składniki',
  options: {
    collapsible: true,
  },
  type: 'array',
  of: [
    {
      type: 'object',
      fields: [
        {name: 'name', title: 'Składnik', type: 'string'},
        {name: 'quantity', title: 'Ilość', type: 'number'},
        {name: 'unit', title: 'Jednostka miary', type: 'string'},
      ],
      preview: {
        select: {quantity: 'quantity', unit: 'unit', name: 'name'},
        prepare({quantity, unit, name}) {
          const parts = []
          if (quantity != null) parts.push(`${quantity}`)
          if (unit) parts.push(unit)
          if (name) parts.push(name)
          return {title: parts.join(' ') || '(brak składnika)'}
        },
      },
    },
  ],
}
