import React from 'react'
import {Stack} from '@sanity/ui'
import {ObjectInputProps} from 'sanity'
import {CollapsibleField} from './CollapsibleField'

export default function DescriptionInput(props: ObjectInputProps) {
  const {renderDefault, value} = props

  return (
    <Stack space={3}>
      <CollapsibleField
        title="Description"
        summary={value?.title ?? 'No title'}
        defaultExpanded={false}
      >
        {renderDefault(props)}
      </CollapsibleField>
    </Stack>
  )
}
