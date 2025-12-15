import React from 'react'
import {Card} from '@sanity/ui'
import {CollapsibleField} from './CollapsibleField'

// Props are generic — forward anything
export const PreparationStepsInput = (props: any) => {
  const {value = [], renderDefault} = props
  const summary = value.length > 0 ? `${value.length} steps` : 'No steps'

  return (
    <CollapsibleField title="Preparation Steps" summary={summary} defaultExpanded={false}>
      <Card
        padding={3}
        radius={2}
        border
        style={{
          maxHeight: '70vh', // scrollable max height
          overflowY: 'auto',
        }}
      >
        {renderDefault && renderDefault(props)}
      </Card>
    </CollapsibleField>
  )
}
export default PreparationStepsInput
