import React from 'react'
import {PatchEvent, set, unset} from 'sanity'
import {Stack, TextInput} from '@sanity/ui'
import {CollapsibleField} from './CollapsibleField'

interface RecipeYieldInputProps {
  value?: number
  onChange: (event: PatchEvent) => void
  schemaType?: {title: string}
  readOnly?: boolean
}

export default function RecipeYieldInput({
  value,
  onChange,
  schemaType,
  readOnly,
}: RecipeYieldInputProps) {
  const title = schemaType?.title || 'Ilość porcji'

  const handleChange = (newValue: string) => {
    const parsed = Number(newValue)
    if (isNaN(parsed)) {
      onChange(PatchEvent.from(unset()))
    } else {
      onChange(PatchEvent.from(set(parsed)))
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (readOnly) return

    let newValue = value ?? 0

    if (event.key === 'ArrowUp') {
      event.preventDefault()
      newValue = newValue + 1
      onChange(PatchEvent.from(set(newValue)))
    } else if (event.key === 'ArrowDown') {
      event.preventDefault()
      newValue = Math.max(1, newValue - 1) // respect min 1
      onChange(PatchEvent.from(set(newValue)))
    }
  }

  return (
    <CollapsibleField title={title} summary={value !== undefined ? value.toString() : 'Add'}>
      <Stack space={2}>
        <TextInput
          type="number"
          value={value !== undefined ? value.toString() : ''}
          readOnly={readOnly}
          onChange={(e) => handleChange(e.currentTarget.value)}
          onKeyDown={handleKeyDown}
          min={1}
        />
      </Stack>
    </CollapsibleField>
  )
}
