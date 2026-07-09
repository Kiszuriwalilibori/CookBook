import React from 'react'
import {Card} from '@sanity/ui'
import {CollapsibleField} from './CollapsibleField'

export const OptionalIngredientsInput = (props: any) => {
  const {value = [], renderDefault} = props

  const summary =
    value.length > 0 ? `${value.length} optional ingredients` : 'No optional ingredients'

  return (
    <CollapsibleField title="Optional ingredients" summary={summary} defaultExpanded={false}>
      <Card
        padding={3}
        radius={2}
        border
        style={{
          maxHeight: '70vh',
          overflowY: 'auto',
        }}
      >
        {renderDefault?.(props)}
      </Card>
    </CollapsibleField>
  )
}

export default OptionalIngredientsInput
