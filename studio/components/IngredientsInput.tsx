import React from 'react'
import {Card} from '@sanity/ui'
import {CollapsibleField} from './CollapsibleField'

// Props are generic — just forward anything
export const IngredientsInput = (props: any) => {
  const {value = [], renderDefault} = props
  const summary = value.length > 0 ? `${value.length} ingredients` : 'No ingredients'

  return (
    <CollapsibleField title="Ingredients" summary={summary} defaultExpanded={true}>
      <Card
        padding={3}
        radius={2}
        border
        style={{
          maxHeight: '70vh', // viewport-based scroll
          overflowY: 'auto',
        }}
      >
        {renderDefault && renderDefault(props)}
      </Card>
    </CollapsibleField>
  )
}
export default IngredientsInput
